// 🚀 FILE TỰ ĐỘNG SINH BỞI ENGINE DOD
use super::MotherboardCore;

impl MotherboardCore {
    pub fn execute_batch(&mut self, chunk_id: usize, mut mask: u32) {
        match self.comp_name.as_str() {
            "ShopManager" => {
                match chunk_id {
                    _ => {}
                }
            },

            "ProductItem" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 20)) != 0 {
                            let v = (if self.i32_mem[6] == self.i32_mem[1] { 1 } else { 0 }) as i32;
                            if self.i32_mem[7] != v {
                                self.i32_mem[7] = v;
                                mask |= 1 << 17;
                            }
                        }
                        if (mask & (1 << 17)) != 0 {
                            let v = (if self.i32_mem[7] != 0 { self.i32_mem[8] } else { self.i32_mem[9] }) as i32;
                            if self.i32_mem[10] != v {
                                self.i32_mem[10] = v;
                                mask |= 1 << 16;
                                mask |= 1 << 3;
                                self.flags_c[1] |= 1 << 27;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 16)) != 0 {
                            let v = ((self.i32_mem[5] - self.i32_mem[10])) as i32;
                            if self.i32_mem[11] != v {
                                self.i32_mem[11] = v;
                                mask |= 1 << 13;
                                mask |= 1 << 10;
                                mask |= 1 << 8;
                                self.flags_r[0] |= 1 << 15;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_c[1] |= 1 << 31;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 13)) != 0 {
                            let v = (if self.i32_mem[11] <= self.i32_mem[12] { 1 } else { 0 }) as i32;
                            if self.i32_mem[13] != v {
                                self.i32_mem[13] = v;
                                self.flags_r[0] |= 1 << 12;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 5;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 4;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 10)) != 0 {
                            let v = (if self.i32_mem[11] > self.i32_mem[14] { 1 } else { 0 }) as i32;
                            if self.i32_mem[15] != v {
                                self.i32_mem[15] = v;
                                mask |= 1 << 7;
                            }
                        }
                        if (mask & (1 << 8)) != 0 {
                            let v = (if self.i32_mem[11] <= self.i32_mem[16] { 1 } else { 0 }) as i32;
                            if self.i32_mem[17] != v {
                                self.i32_mem[17] = v;
                                mask |= 1 << 7;
                            }
                        }
                        if (mask & (1 << 7)) != 0 {
                            let v = (if self.i32_mem[15] != 0 && self.i32_mem[17] != 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[18] != v {
                                self.i32_mem[18] = v;
                                self.flags_r[0] |= 1 << 6;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 3)) != 0 {
                            let v = (if self.i32_mem[10] < self.i32_mem[5] { 1 } else { 0 }) as i32;
                            if self.i32_mem[19] != v {
                                self.i32_mem[19] = v;
                                mask |= 1 << 0;
                            }
                        }
                        if (mask & (1 << 0)) != 0 {
                            let v = (if self.i32_mem[19] != 0 { self.i32_mem[20] } else { self.i32_mem[21] }) as i32;
                            if self.i32_mem[22] != v {
                                self.i32_mem[22] = v;
                                self.flags_c[1] |= 1 << 31;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                                self.flags_c[1] |= 1 << 27;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                            }
                        }
                    },
                    1 => {
                        if (mask & (1 << 31)) != 0 {
                            let v = ((self.i32_mem[11] - self.i32_mem[22])) as i32;
                            if self.i32_mem[23] != v {
                                self.i32_mem[23] = v;
                                mask |= 1 << 29;
                            }
                        }
                        if (mask & (1 << 29)) != 0 {
                            let v = (if self.i32_mem[23] <= self.i32_mem[24] { 1 } else { 0 }) as i32;
                            if self.i32_mem[25] != v {
                                self.i32_mem[25] = v;
                            }
                        }
                        if (mask & (1 << 27)) != 0 {
                            let v = ((self.i32_mem[10] + self.i32_mem[22])) as i32;
                            if self.i32_mem[27] != v {
                                self.i32_mem[27] = v;
                            }
                        }
                    },
                    _ => {}
                }
            },

            "Cart" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 22)) != 0 {
                            let v = ((self.i32_mem[2] * self.i32_mem[5])) as i32;
                            if self.i32_mem[6] != v {
                                self.i32_mem[6] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = ((self.i32_mem[6] as f64 / self.i32_mem[7] as f64)) as f64;
                            if self.f64_mem[0] != v {
                                self.f64_mem[0] = v;
                                mask |= 1 << 19;
                            }
                        }
                        if (mask & (1 << 19)) != 0 {
                            let v = (self.f64_mem[0] as i32) as i32;
                            if self.i32_mem[8] != v {
                                self.i32_mem[8] = v;
                                mask |= 1 << 13;
                            }
                        }
                        if (mask & (1 << 14)) != 0 {
                            let v = (if self.i32_mem[10] != 0 { self.i32_mem[11] } else { self.i32_mem[12] }) as i32;
                            if self.i32_mem[13] != v {
                                self.i32_mem[13] = v;
                                mask |= 1 << 13;
                            }
                        }
                        if (mask & (1 << 13)) != 0 {
                            let v = (if self.i32_mem[4] != 0 { self.i32_mem[8] } else { self.i32_mem[13] }) as i32;
                            if self.i32_mem[14] != v {
                                self.i32_mem[14] = v;
                                mask |= 1 << 12;
                            }
                        }
                        if (mask & (1 << 12)) != 0 {
                            let v = ((self.i32_mem[14]).min(self.i32_mem[2])) as i32;
                            if self.i32_mem[15] != v {
                                self.i32_mem[15] = v;
                                mask |= 1 << 10;
                                self.flags_r[0] |= 1 << 11;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 10)) != 0 {
                            let v = ((self.i32_mem[2] - self.i32_mem[15])) as i32;
                            if self.i32_mem[16] != v {
                                self.i32_mem[16] = v;
                                mask |= 1 << 8;
                                mask |= 1 << 3;
                            }
                        }
                        if (mask & (1 << 8)) != 0 {
                            let v = ((self.i32_mem[16] * self.i32_mem[17])) as i32;
                            if self.i32_mem[18] != v {
                                self.i32_mem[18] = v;
                                mask |= 1 << 6;
                            }
                        }
                        if (mask & (1 << 6)) != 0 {
                            let v = ((self.i32_mem[18] as f64 / self.i32_mem[19] as f64)) as f64;
                            if self.f64_mem[1] != v {
                                self.f64_mem[1] = v;
                                mask |= 1 << 5;
                            }
                        }
                        if (mask & (1 << 5)) != 0 {
                            let v = (self.f64_mem[1] as i32) as i32;
                            if self.i32_mem[20] != v {
                                self.i32_mem[20] = v;
                                mask |= 1 << 3;
                                self.flags_r[0] |= 1 << 4;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 3)) != 0 {
                            let v = ((self.i32_mem[16] + self.i32_mem[20])) as i32;
                            if self.i32_mem[21] != v {
                                self.i32_mem[21] = v;
                                self.flags_r[0] |= 1 << 2;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 0)) != 0 {
                            let v = (if self.i32_mem[1] > self.i32_mem[22] { 1 } else { 0 }) as i32;
                            if self.i32_mem[23] != v {
                                self.i32_mem[23] = v;
                                self.flags_r[1] |= 1 << 31;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                    },
                    1 => {
                        if (mask & (1 << 27)) != 0 {
                            let v = ((self.i32_mem[1] + self.i32_mem[25])) as i32;
                            if self.i32_mem[26] != v {
                                self.i32_mem[26] = v;
                            }
                        }
                        if (mask & (1 << 26)) != 0 {
                            let v = (self.i32_mem[25] as f64) as f64;
                            if self.f64_mem[3] != v {
                                self.f64_mem[3] = v;
                                mask |= 1 << 25;
                            }
                        }
                        if (mask & (1 << 25)) != 0 {
                            let v = ((self.f64_mem[3] * self.f64_mem[2])) as f64;
                            if self.f64_mem[4] != v {
                                self.f64_mem[4] = v;
                                mask |= 1 << 24;
                            }
                        }
                        if (mask & (1 << 24)) != 0 {
                            let v = (self.f64_mem[4] as i32) as i32;
                            if self.i32_mem[27] != v {
                                self.i32_mem[27] = v;
                                mask |= 1 << 23;
                            }
                        }
                        if (mask & (1 << 23)) != 0 {
                            let v = ((self.i32_mem[2] + self.i32_mem[27])) as i32;
                            if self.i32_mem[28] != v {
                                self.i32_mem[28] = v;
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

            _ => {}
        }
    }
}
