<script lang="ts">
  import { ChromeExt } from "../ext/chrome";
  import { defaultStorage } from "../types";
  import type { IStorage } from "../types";

  let question: string;
  let bodies: string[];
  let ind = 0;

  async function get_rankings() {
    const ret = await fetch("http://localhost:5000/model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        bodies,
      }),
    });
    const resIdx = await ret.json();
    return resIdx;
  }

  async function get_results() {
    // let s = await new Promise<IStorage>((res, rej) =>
    //   ChromeExt.StorageSyncGet("question", (s) => res(s))
    // );
    // console.log(s)
    // console.log(s)

    // bodies = s.bodies;
    // question = s.question;
    const ret = await ChromeExt.StorageGet([
      "question",
      "bodies",
    ]);
    bodies = ret.bodies
    question = ret.question
    console.log(bodies, question);
    const idxs = await get_rankings();
    console.log("AAAS");
    const results = idxs.map((rank) => bodies[rank]);
    return results;
  }
  const get_res_prom = get_results();
</script>

<style>
  .container {
    min-width: 250px;
  }

  button {
    border-radius: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    background-color: #2ecc71;
    color: #ecf0f1;
    transition: background-color 0.3s;
    padding: 5px 10px;
    border: none;
  }

  button:hover,
  button:focus {
    background-color: #27ae60;
  }

  .success {
    color: #2ecc71;
    font-weight: bold;
  }
</style>

<div class="container">
  <h2>Results for: <b>{question}</b></h2>
  {#await get_res_prom}
    Loading
  {:then results}
    <div class="answer">
      {#if results}
        <p>{results[ind]}</p>
        <br />
        <p>Answer #{ind + 1}</p>
        <button on:click={() => ind--}>Previous</button>
        <button on:click={() => ind++}>Next</button>
      {/if}
    </div>
  {/await}
</div>
