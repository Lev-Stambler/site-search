from flask import Flask
from flask import request, jsonify
import numpy as np
import sys
from transformers import pipeline

nlp = pipeline("question-answering")
print(nlp.device)
app = Flask(__name__)

# print(nlp(question="What is extractive question answering?", context=context))
# print(nlp(question="What is a good example of a question answering dataset?", context=context))


def get_nlp_res(q, context):
    return nlp(question=r'{}'.format(q), context=r'{}'.format(context))


def find_best_paragraphs(question, bodies):
    # print(bodies, question)
    # print(question, bodies[10])
    question = r'{}'.format(question)
    print(nlp(question=question, context=r'{}'.format(bodies[10])))
    total = len(bodies)

    def get_score(i, p):
        print(f'Going on {i+1}/{total}')
        try:
            # print(p)
            return get_nlp_res(question, p)["score"]
        except:
            # print(sys.exc_info()[0])
            return -1
    # scores = [nlp(question=question, context=p)["score"] for p in bodies]
    scores = [get_score(i, p) for i, p in enumerate(bodies)]
    ret = list(np.argsort(scores))[::-1]
    return ret


@app.route('/model', methods=['POST'])
def handle_model():
    if request.method == "POST":
        data = request.get_json()
        bodies = data["bodies"]
        question = data["question"]
        print(question)
        best_ps_index = find_best_paragraphs(question, bodies)
        print(get_nlp_res(question, "\n".join(bodies)))
        return str(best_ps_index)
    return "NO GOOD"
