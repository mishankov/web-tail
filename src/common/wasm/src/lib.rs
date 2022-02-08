mod utils;

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use uuid::Uuid;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, World!");
}

#[wasm_bindgen]
pub fn get_uuid() -> String {
  Uuid::new_v4().to_simple().to_string()
}
