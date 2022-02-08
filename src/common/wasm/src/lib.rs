extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use uuid::Uuid;

#[wasm_bindgen]
pub fn get_uuid() -> String {
  Uuid::new_v4().to_simple().to_string()
}
