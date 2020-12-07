import { Tensor, InferenceSession } from "onnxjs";
import { encode, tokenizerSetup } from "./encodings";
import { modelForward } from "./model-forward";
const session = new InferenceSession();

export async function runModel() {
  // run this in an async method:

  const url = "./models/qa_model.onnx";
  await session.loadModel(url);
  await tokenizerSetup();
  const encoded = await encode(`If we all supposeably came from Adam & Eve why is it that there is so many race's? Shouln't we all be the 1 ?

  Even if you are a beliver of creationism (god created the Earth) it does not exclude the possibilty that modern races evolved from the two first humans (adam and eve).  It is true that certain distiguishing features arise from populations centered in different climate zones.  Human populations origionating from northern Europe and Asia have much lighter pigmented skin than those from closer to the equator.  However, there are unexplained reasons as to why southeast Asians developed differently from the populations of Africa.  Either way all human population origionates in northeastern Africa and the Middle East and fans out from there.  As humans began to settle in different corners of the Earth, They became cut off from each other and did not meet until their features were clearly different from one another.
  `)

  await modelForward([0, 1, 2], session);
}
