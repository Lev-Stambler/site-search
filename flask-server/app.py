from flask import Flask
from flask import request, jsonify
import itertools
import torch
import numpy as np
import gunicorn

from transformers import DistilBertTokenizerFast
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
model = torch.load('trained-eval.pt', map_location=torch.device('cpu'))
model.eval()
app = Flask(__name__)

# TODO, I can add some batching to the paragraphs


def text_to_out_val(text):
    indexed_tokens = tokenizer.encode(text, truncation=True, max_length=512)
    tokens_tensor = torch.tensor([indexed_tokens])
    tokens_tensor = tokens_tensor.to('cpu')
    with torch.no_grad():
        out = model(tokens_tensor)[0]
        if (len(out) == 2):
            out, _ = out
        val = out[0]
        return list(val)

# def eval_body_sentences(body, question):
#     sentences = body.split(".")
#     model_outs = [text_to_out_val(question + "\n\n + sentence") for sentence in sentences]
#     sim_scores = [model_out[1] - model_out[0] for model_out in model_outs]
#     sim_scores_sorted = list(numpy.argsort(sim_scores))[::-1]
#     return list(numpy.take(sentences, sim_scores_sorted))


def combine_question_answer(question, answer):
    # TODO just for in end?
    if '?' not in question:
        question = question + '?'
    ret = f'{question}\n\n{answer}'
    print(ret)
    return ret


def model_out_to_score(model_out):
    return model_out[1] - model_out[0]


# If an individual sentence has a higher score than the paragraph, return that score
# def score_paragraph_by_sentence(model, question, paragraph, p_score):
#     model_outs = [text_to_out_val(combine_question_answer(
#         question, sentence)) for sentence in paragraph.split(". ")]
#     out = 0
#     for model_out in model_outs:
#         score = model_out_to_score(model_out)
#         out = (score if score > out else out)
#     print(paragraph, out, p_score)
#     return out if out > p_score else p_score


def get_scored_ranked_paragraphs(model, question, paragraphs):
    model_outs = [text_to_out_val(combine_question_answer(
        question, body)) for body in paragraphs]
    sim_scores = [model_out_to_score(model_out) for model_out in model_outs]
    ret = list(np.argsort(sim_scores))[::-1]
    return ret, sim_scores

# return a list of indexes sorted by the relation score sorted in a descending order


def find_best_paragraphs(model, question, paragraphs):
    ranked_by_p_idx, p_scores = get_scored_ranked_paragraphs(
        model, question, paragraphs)
    # idx_cut_off = 20 if len(ranked_by_p_idx) > 20 else len(ranked_by_p_idx)
    # ranked_by_p_cut = np.array(paragraphs)[ranked_by_p_idx[:idx_cut_off]]
    # ranked_by_sentence = [score_paragraph_by_sentence(
    #     model, question, p, p_scores[ranked_by_p_idx[i]]) for i, p in enumerate(ranked_by_p_cut)]
    # sorted_sentence_score_idx = list(np.argsort(ranked_by_sentence)[::-1])
    # return list(np.array(ranked_by_p_idx)[sorted_sentence_score_idx])
    return list(np.array(ranked_by_p_idx))


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/model', methods=['POST'])
def handle_model():
    if request.method == "POST":
        data = request.get_json()
        bodies = data["bodies"]
        question = data["question"]
        # take_highest_n = 15 if len(sorted_rank_idxs) > 15 else len(sorted_rank_idxs)
        best_ps_index = find_best_paragraphs(model, question, bodies)
        # sorted_rank_idxs_cut = sorted_rank_idxs[:take_highest_n]
        # evaled_sentences = [eval_body_sentences(body, question) for body in numpy.take(bodies, sorted_rank_idxs_cut)]
        # evaled_sentences = list(itertools.chain(*evaled_sentences))
        # return str(evaled_sentences)
        return str(best_ps_index)
    return "NO GOOD"

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)