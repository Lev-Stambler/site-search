from transformers import BertTokenizer
import math
from flask import Flask
from flask import request, jsonify
import itertools
import torch
import numpy as np
import gunicorn
BATCH_SIZE = 8

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = torch.load('model.pt', map_location=torch.device('cpu'))
model.eval()
# model.half()

app = Flask(__name__)

# TODO, I can add some batching to the paragraphs


def tokenize(q, answer):
    tok_out = tokenizer(answer, q, truncation=True,
                        padding='max_length', max_length=512, return_tensors='pt')
    return {key: value.to('cpu') for key, value in tok_out.items()}


# def text_to_out_val(q, answer):
#     inp = tokenize([q], [answer])
#     n_lists = len(answer)
#     with torch.no_grad():
#         # print(inp)
#         out = model(**inp)[0]
#         # print(out)
#         if (len(out) == 2):
#             out, _ = out
#         val = out[0]
#         return list(val)

def model_out_to_score(model_out):
    return model_out[1] - model_out[0]


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def get_scored_ranked_paragraphs(model, question, paragraphs):
    # n_lists = math.ceil(len(paragraphs) / BATCH_SIZE)
    model_outs = torch.empty((0, 2))
    with torch.no_grad():
        for ps in chunks(paragraphs, BATCH_SIZE):
            # print(ps)
            print(len(ps))
            model_inps = tokenize([question] * len(ps), ps)
            outs = model(**model_inps)["logits"]
            model_outs = torch.cat((model_outs, outs))
            print(model_outs.size())
    print(model_outs)
    sim_scores = [model_out_to_score(model_out)
                  for model_out in model_outs.tolist()]
    ret = list(np.argsort(sim_scores))[::-1]
    return ret, sim_scores

# return a list of indexes sorted by the relation score sorted in a descending order


def find_best_paragraphs(model, question, paragraphs):
    ranked_by_p_idx, p_scores = get_scored_ranked_paragraphs(
        model, question, paragraphs)
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
    # TODO have debug be an env var
    app.run(threaded=True, port=5000, debug=True)


# TODOs get like top 10 paragraphs
# via some sort of distance algorithm... then use deep search
