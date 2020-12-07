import { Tensor, InferenceSession } from "onnxjs";

export async function modelForward(
  encoded: number[],
  session: InferenceSession
) {
  const inputs = [new Tensor(encoded, "int32")];
  const outputMap = await session.run(inputs);
  const outputTensor = outputMap.values().next().value;
  console.log(outputTensor)
  return outputTensor
}
