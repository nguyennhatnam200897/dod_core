// 🚀 FILE TỰ ĐỘNG SINH BỞI ENGINE DOD
use super::MotherboardCore;

impl MotherboardCore {
    pub fn execute_batch(&mut self, chunk_id: usize, mut mask: u32) {
        match self.comp_name.as_str() {
            "HomeView" => {
                match chunk_id {
                    _ => {}
                }
            },

            "Cart" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 24)) != 0 {
                            let v = ((self.f64_mem[0] * self.f64_mem[1])) as f64;
                            if self.f64_mem[2] != v {
                                self.f64_mem[2] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 21)) != 0 {
                            let v = (self.i32_mem[3] as f64) as f64;
                            if self.f64_mem[3] != v {
                                self.f64_mem[3] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = ((self.f64_mem[2] * self.f64_mem[3])) as f64;
                            if self.f64_mem[4] != v {
                                self.f64_mem[4] = v;
                                mask |= 1 << 13;
                            }
                        }
                        if (mask & (1 << 18)) != 0 {
                            let v = (self.i32_mem[4] as f64) as f64;
                            if self.f64_mem[5] != v {
                                self.f64_mem[5] = v;
                                mask |= 1 << 14;
                            }
                        }
                        if (mask & (1 << 15)) != 0 {
                            let v = (self.i32_mem[6] as f64) as f64;
                            if self.f64_mem[6] != v {
                                self.f64_mem[6] = v;
                                mask |= 1 << 14;
                            }
                        }
                        if (mask & (1 << 14)) != 0 {
                            let v = ((self.f64_mem[5] * self.f64_mem[6])) as f64;
                            if self.f64_mem[7] != v {
                                self.f64_mem[7] = v;
                                mask |= 1 << 13;
                            }
                        }
                        if (mask & (1 << 13)) != 0 {
                            let v = ((self.f64_mem[4] + self.f64_mem[7])) as f64;
                            if self.f64_mem[8] != v {
                                self.f64_mem[8] = v;
                                mask |= 1 << 12;
                                mask |= 1 << 6;
                            }
                        }
                        if (mask & (1 << 12)) != 0 {
                            let v = (if self.f64_mem[8] > self.f64_mem[0] { 1 } else { 0 }) as i32;
                            if self.i32_mem[7] != v {
                                self.i32_mem[7] = v;
                                mask |= 1 << 11;
                            }
                        }
                        if (mask & (1 << 11)) != 0 {
                            let v = (self.i32_mem[7] as f64) as f64;
                            if self.f64_mem[9] != v {
                                self.f64_mem[9] = v;
                                mask |= 1 << 7;
                                mask |= 1 << 10;
                            }
                        }
                        if (mask & (1 << 10)) != 0 {
                            let v = ((self.f64_mem[9] * self.f64_mem[0])) as f64;
                            if self.f64_mem[10] != v {
                                self.f64_mem[10] = v;
                                mask |= 1 << 5;
                            }
                        }
                        if (mask & (1 << 8)) != 0 {
                            let v = (self.i32_mem[8] as f64) as f64;
                            if self.f64_mem[11] != v {
                                self.f64_mem[11] = v;
                                mask |= 1 << 7;
                            }
                        }
                        if (mask & (1 << 7)) != 0 {
                            let v = ((self.f64_mem[11] - self.f64_mem[9])) as f64;
                            if self.f64_mem[12] != v {
                                self.f64_mem[12] = v;
                                mask |= 1 << 6;
                            }
                        }
                        if (mask & (1 << 6)) != 0 {
                            let v = ((self.f64_mem[12] * self.f64_mem[8])) as f64;
                            if self.f64_mem[13] != v {
                                self.f64_mem[13] = v;
                                mask |= 1 << 5;
                            }
                        }
                        if (mask & (1 << 5)) != 0 {
                            let v = ((self.f64_mem[10] + self.f64_mem[13])) as f64;
                            if self.f64_mem[14] != v {
                                self.f64_mem[14] = v;
                                mask |= 1 << 3;
                                self.flags_r[0] |= 1 << 4;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 3)) != 0 {
                            let v = ((self.f64_mem[0] - self.f64_mem[14])) as f64;
                            if self.f64_mem[15] != v {
                                self.f64_mem[15] = v;
                                mask |= 1 << 1;
                                self.flags_c[1] |= 1 << 31;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 1)) != 0 {
                            let v = ((self.f64_mem[15] * self.f64_mem[16])) as f64;
                            if self.f64_mem[17] != v {
                                self.f64_mem[17] = v;
                                self.flags_c[1] |= 1 << 31;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 0;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                    },
                    1 => {
                        if (mask & (1 << 31)) != 0 {
                            let v = ((self.f64_mem[15] + self.f64_mem[17])) as f64;
                            if self.f64_mem[18] != v {
                                self.f64_mem[18] = v;
                                self.flags_r[1] |= 1 << 30;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                    },
                    _ => {}
                }
            },

            "PopupModal" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 24)) != 0 {
                            let v = (if self.i32_mem[2] != 0 { self.i32_mem[4] } else { self.i32_mem[0] }) as i32;
                            if self.i32_mem[5] != v {
                                self.i32_mem[5] = v;
                            }
                        }
                        if (mask & (1 << 23)) != 0 {
                            let v = (if self.i32_mem[2] != 0 { self.i32_mem[3] } else { self.i32_mem[1] }) as i32;
                            if self.i32_mem[6] != v {
                                self.i32_mem[6] = v;
                            }
                        }
                    },
                    _ => {}
                }
            },

            "ProductItem" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 23)) != 0 {
                            let v = ((self.i32_mem[2] - self.i32_mem[3])) as i32;
                            if self.i32_mem[4] != v {
                                self.i32_mem[4] = v;
                                mask |= 1 << 20;
                                self.flags_r[0] |= 1 << 22;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                mask |= 1 << 12;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = (if self.i32_mem[4] <= self.i32_mem[5] { 1 } else { 0 }) as i32;
                            if self.i32_mem[6] != v {
                                self.i32_mem[6] = v;
                                self.flags_r[0] |= 1 << 19;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 18;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 17;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 12)) != 0 {
                            let v = (if self.i32_mem[4] > self.i32_mem[10] { 1 } else { 0 }) as i32;
                            if self.i32_mem[11] != v {
                                self.i32_mem[11] = v;
                            }
                        }
                    },
                    _ => {}
                }
            },

            "HeaderView" => {
                match chunk_id {
                    _ => {}
                }
            },

            _ => {}
        }
    }
}
