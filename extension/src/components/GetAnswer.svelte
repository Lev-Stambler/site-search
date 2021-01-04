<script lang="ts">
  import { ChromeExt } from "../ext/chrome";

  import type { IStorage } from "../types";
  let question = "";
  let answers;
  let answer_ind = 0;

  function get_paragaphs() {
    return new Promise<string[]>((resolve, rej) => {
      const code = `(function getParagraphTexts(){
        console.log("ASASASASAS")
        const ps = Array.from(document.querySelectorAll('p')).map(i => i.innerText)
        console.log(ps)
        return ps
    })()`;
      ChromeExt.TabQuery({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        ChromeExt.ExecScript(
          tab.id,
          {
            code,
          },
          (ps) => {
            resolve(ps[0]);
          }
        );
      });
    });
  }

  async function new_tab() {
    chrome.tabs.create({ url: `question_answers.html` });
  }

  // The following is depreciated
  /*
  async function get_rankings(bodies: string[]) {
    const ret = await fetch("http://localhost:8000/model", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
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
*/

  async function search_article() {
    const ps = await get_paragaphs();
    // console.log(question, ps)
    await ChromeExt.StorageSet({ bodies: ps, question });
    new_tab();
    // const rankings = await get_rankings(ps);
    // console.log(rankings.map((rank) => ps[rank]));
    // const _answers = rankings.map((rank) => ps[rank]);
    // ChromeExt.StorageSyncSet({ results: _answers }, () => {
    //   answers = _answers;
    //   answer_ind = 0;
    //   const newURL = "/new_tab_res.html";
    //   console.log("AASASASA");
    //   // chrome.tabs.create({ url: newURL });
    // });
  }
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
  <div>
    <textarea name="" bind:value={question} id="" cols="30" rows="10" />
    <button on:click={search_article}>Find what you be looking for!</button>
  </div>
  <div class="answer">
    {#if answers}
      <p>{answers[answer_ind]}</p>
      <br />
      <p>Answer #{answer_ind + 1}</p>
      <button on:click={() => answer_ind--}>Previous</button>
      <button on:click={() => answer_ind++}>Next</button>
    {/if}
  </div>
</div>
