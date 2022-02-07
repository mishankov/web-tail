mod utils;

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, World!");
}

#[wasm_bindgen]
pub struct CircularBufferItem {
  id: i32,
  item: String
}

// impl Copy for CircularBufferItem { }
// impl Clone for CircularBufferItem { }


#[wasm_bindgen]
pub struct CircularBufferItemList {
  list: Vec<CircularBufferItem>
}

#[wasm_bindgen]
pub struct CircularBuffer {
  length: usize,
  items:  CircularBufferItemList,
  last_position: usize
}

#[wasm_bindgen]
impl CircularBuffer {
  #[wasm_bindgen(constructor)]
  pub fn new(length: usize) -> CircularBuffer {
    CircularBuffer { 
      length: length, 
      last_position: usize::MAX,
      items: CircularBufferItemList{list: Vec::new()}
    }
  }

  pub fn push(&mut self, item: String) {
    if self.last_position == usize::MAX {
      self.last_position = 0
    } else {
      self.last_position = (self.last_position + 1) % self.length;
    }
    

    if self.length == self.items.list.len() {
      self.items.list[self.last_position].item = item;
    } else {
      self.items.list.push(CircularBufferItem{id: 1i32, item: item})
    }
  }

  pub fn to_vec(self) -> CircularBufferItemList {
    if self.last_position == self.items.list.len() - 1 {
      return self.items
    } else {
      let mut new_items = Vec::new();
      let mut current_item_num = 0;

      for item in self.items.list {
        let current_item = self.items.list[(current_item_num + self.last_position + 1) % self.length].item;
        let current_item_id = self.items.list[(current_item_num + self.last_position + 1) % self.length].id;
        let current = CircularBufferItem {
          id: current_item_id,
          item: current_item
        };
        
        new_items.push(current);
        current_item_num += 1;
      }

      CircularBufferItemList {
        list: new_items
      }
    }
  }
}
