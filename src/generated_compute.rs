// 🚀 FILE TỰ ĐỘNG SINH BỞI ENGINE DOD
use super::MotherboardCore;

impl MotherboardCore {
    pub fn execute_batch(&mut self, chunk_id: usize, mut mask: u32) {
        match self.comp_name.as_str() {
            "PlatformManager" => {
                match chunk_id {
                    _ => {}
                }
            },

            "ShopCard" => {
                match chunk_id {
                    0 => {
                        if (mask & (1 << 28)) != 0 {
                            let v = (if self.f64_mem[0] >= self.f64_mem[1] { 1 } else { 0 }) as i32;
                            if self.i32_mem[1] != v {
                                self.i32_mem[1] = v;
                                self.flags_r[0] |= 1 << 27;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 21)) != 0 {
                            let v = (self.i32_mem[4] as f64) as f64;
                            if self.f64_mem[2] != v {
                                self.f64_mem[2] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = (if self.f64_mem[0] >= self.f64_mem[2] { 1 } else { 0 }) as i32;
                            if self.i32_mem[5] != v {
                                self.i32_mem[5] = v;
                                mask |= 1 << 10;
                                self.flags_c[1] |= 1 << 24;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
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
                        if (mask & (1 << 15)) != 0 {
                            let v = (self.i32_mem[6] as f64) as f64;
                            if self.f64_mem[3] != v {
                                self.f64_mem[3] = v;
                                mask |= 1 << 14;
                            }
                        }
                        if (mask & (1 << 14)) != 0 {
                            let v = (if self.f64_mem[0] < self.f64_mem[3] { 1 } else { 0 }) as i32;
                            if self.i32_mem[7] != v {
                                self.i32_mem[7] = v;
                                mask |= 1 << 9;
                                self.flags_r[0] |= 1 << 13;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 12;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 11;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 10)) != 0 {
                            let v = (if self.i32_mem[5] == 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[8] != v {
                                self.i32_mem[8] = v;
                                mask |= 1 << 8;
                            }
                        }
                        if (mask & (1 << 9)) != 0 {
                            let v = (if self.i32_mem[7] == 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[9] != v {
                                self.i32_mem[9] = v;
                                mask |= 1 << 8;
                            }
                        }
                        if (mask & (1 << 8)) != 0 {
                            let v = (if self.i32_mem[8] != 0 && self.i32_mem[9] != 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[10] != v {
                                self.i32_mem[10] = v;
                                self.flags_r[0] |= 1 << 7;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 6;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 5;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                    },
                    1 => {
                        if (mask & (1 << 31)) != 0 {
                            let v = ((self.i32_mem[12] >> self.i32_mem[13])) as i32;
                            if self.i32_mem[14] != v {
                                self.i32_mem[14] = v;
                                mask |= 1 << 29;
                            }
                        }
                        if (mask & (1 << 29)) != 0 {
                            let v = ((self.i32_mem[14] * self.i32_mem[15])) as i32;
                            if self.i32_mem[16] != v {
                                self.i32_mem[16] = v;
                                mask |= 1 << 28;
                            }
                        }
                        if (mask & (1 << 28)) != 0 {
                            let v = (if self.i32_mem[16] > self.i32_mem[11] { 1 } else { 0 }) as i32;
                            if self.i32_mem[17] != v {
                                self.i32_mem[17] = v;
                                self.flags_r[1] |= 1 << 27;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 25)) != 0 {
                            let v = (if self.i32_mem[11] > self.i32_mem[18] { 1 } else { 0 }) as i32;
                            if self.i32_mem[19] != v {
                                self.i32_mem[19] = v;
                                mask |= 1 << 24;
                            }
                        }
                        if (mask & (1 << 24)) != 0 {
                            let v = (if self.i32_mem[5] != 0 && self.i32_mem[19] != 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[20] != v {
                                self.i32_mem[20] = v;
                                self.flags_r[1] |= 1 << 23;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 21)) != 0 {
                            let v = ((self.i32_mem[12] & self.i32_mem[21])) as i32;
                            if self.i32_mem[22] != v {
                                self.i32_mem[22] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = (self.i32_mem[22] as f64) as f64;
                            if self.f64_mem[4] != v {
                                self.f64_mem[4] = v;
                                mask |= 1 << 18;
                            }
                        }
                        if (mask & (1 << 19)) != 0 {
                            let v = (self.i32_mem[11] as f64) as f64;
                            if self.f64_mem[5] != v {
                                self.f64_mem[5] = v;
                                mask |= 1 << 18;
                            }
                        }
                        if (mask & (1 << 18)) != 0 {
                            let v = ((self.f64_mem[4] as f64 / self.f64_mem[5] as f64)) as f64;
                            if self.f64_mem[6] != v {
                                self.f64_mem[6] = v;
                                mask |= 1 << 15;
                            }
                        }
                        if (mask & (1 << 16)) != 0 {
                            let v = (self.i32_mem[23] as f64) as f64;
                            if self.f64_mem[7] != v {
                                self.f64_mem[7] = v;
                                mask |= 1 << 15;
                            }
                        }
                        if (mask & (1 << 15)) != 0 {
                            let v = ((self.f64_mem[6] * self.f64_mem[7])) as f64;
                            if self.f64_mem[8] != v {
                                self.f64_mem[8] = v;
                                self.flags_r[1] |= 1 << 14;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
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
