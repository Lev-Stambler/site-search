use wasm_bindgen::prelude::*;
use tokenizers::tokenizer::{Result, Tokenizer, EncodeInput};
use tokenizers::models::bpe::BPE;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn encode(txt: &str) {
    let bpe_builder = BPE();
    let bpe = bpe_builder
        .dropout(0.1)
        .unk_token("[UNK]".into())
        .build();

    let mut tokenizer = Tokenizer::new(bpe);

    let encoding = tokenizer.encode(txt, false);
    return encoding;
}

#[wasm_bindgen]
pub fn runmodel() {
    
}