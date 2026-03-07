// 🚀 FILE TỰ ĐỘNG SINH BỞI ENGINE DOD
use super::MotherboardCore;

impl MotherboardCore {
    pub fn execute_batch(&mut self, chunk_id: usize, mut mask: u32) {
        match self.comp_name.as_str() {
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
                        if (mask & (1 << 23)) != 0 {
                            let v = (self.i32_mem[3] as f64) as f64;
                            if self.f64_mem[2] != v {
                                self.f64_mem[2] = v;
                                mask |= 1 << 22;
                            }
                        }
                        if (mask & (1 << 22)) != 0 {
                            let v = (if self.f64_mem[0] >= self.f64_mem[2] { 1 } else { 0 }) as i32;
                            if self.i32_mem[4] != v {
                                self.i32_mem[4] = v;
                                mask |= 1 << 12;
                                self.flags_c[1] |= 1 << 26;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 21;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 20;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 19;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 17)) != 0 {
                            let v = (self.i32_mem[5] as f64) as f64;
                            if self.f64_mem[3] != v {
                                self.f64_mem[3] = v;
                                mask |= 1 << 16;
                            }
                        }
                        if (mask & (1 << 16)) != 0 {
                            let v = (if self.f64_mem[0] < self.f64_mem[3] { 1 } else { 0 }) as i32;
                            if self.i32_mem[6] != v {
                                self.i32_mem[6] = v;
                                mask |= 1 << 11;
                                self.flags_r[0] |= 1 << 15;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 14;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 13;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 12)) != 0 {
                            let v = (if self.i32_mem[4] == 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[7] != v {
                                self.i32_mem[7] = v;
                                mask |= 1 << 10;
                            }
                        }
                        if (mask & (1 << 11)) != 0 {
                            let v = (if self.i32_mem[6] == 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[8] != v {
                                self.i32_mem[8] = v;
                                mask |= 1 << 10;
                            }
                        }
                        if (mask & (1 << 10)) != 0 {
                            let v = (if self.i32_mem[7] != 0 && self.i32_mem[8] != 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[9] != v {
                                self.i32_mem[9] = v;
                                self.flags_r[0] |= 1 << 9;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 8;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                                self.flags_r[0] |= 1 << 7;
                                self.l2_r[0] |= 1 << 31;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 1)) != 0 {
                            let v = ((self.i32_mem[11] >> self.i32_mem[12])) as i32;
                            if self.i32_mem[13] != v {
                                self.i32_mem[13] = v;
                                self.flags_c[1] |= 1 << 31;
                                self.l2_c[0] |= 1 << 30;
                                self.l1_c[0] |= 1 << 31;
                            }
                        }
                    },
                    1 => {
                        if (mask & (1 << 31)) != 0 {
                            let v = ((self.i32_mem[13] * self.i32_mem[14])) as i32;
                            if self.i32_mem[15] != v {
                                self.i32_mem[15] = v;
                                mask |= 1 << 30;
                            }
                        }
                        if (mask & (1 << 30)) != 0 {
                            let v = (if self.i32_mem[15] > self.i32_mem[10] { 1 } else { 0 }) as i32;
                            if self.i32_mem[16] != v {
                                self.i32_mem[16] = v;
                                self.flags_r[1] |= 1 << 29;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 27)) != 0 {
                            let v = (if self.i32_mem[10] > self.i32_mem[17] { 1 } else { 0 }) as i32;
                            if self.i32_mem[18] != v {
                                self.i32_mem[18] = v;
                                mask |= 1 << 26;
                            }
                        }
                        if (mask & (1 << 26)) != 0 {
                            let v = (if self.i32_mem[4] != 0 && self.i32_mem[18] != 0 { 1 } else { 0 }) as i32;
                            if self.i32_mem[19] != v {
                                self.i32_mem[19] = v;
                                self.flags_r[1] |= 1 << 25;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                        if (mask & (1 << 23)) != 0 {
                            let v = ((self.i32_mem[11] & self.i32_mem[20])) as i32;
                            if self.i32_mem[21] != v {
                                self.i32_mem[21] = v;
                                mask |= 1 << 22;
                            }
                        }
                        if (mask & (1 << 22)) != 0 {
                            let v = (self.i32_mem[21] as f64) as f64;
                            if self.f64_mem[4] != v {
                                self.f64_mem[4] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 21)) != 0 {
                            let v = (self.i32_mem[10] as f64) as f64;
                            if self.f64_mem[5] != v {
                                self.f64_mem[5] = v;
                                mask |= 1 << 20;
                            }
                        }
                        if (mask & (1 << 20)) != 0 {
                            let v = ((self.f64_mem[4] as f64 / self.f64_mem[5] as f64)) as f64;
                            if self.f64_mem[6] != v {
                                self.f64_mem[6] = v;
                                mask |= 1 << 17;
                            }
                        }
                        if (mask & (1 << 18)) != 0 {
                            let v = (self.i32_mem[22] as f64) as f64;
                            if self.f64_mem[7] != v {
                                self.f64_mem[7] = v;
                                mask |= 1 << 17;
                            }
                        }
                        if (mask & (1 << 17)) != 0 {
                            let v = ((self.f64_mem[6] * self.f64_mem[7])) as f64;
                            if self.f64_mem[8] != v {
                                self.f64_mem[8] = v;
                                self.flags_r[1] |= 1 << 16;
                                self.l2_r[0] |= 1 << 30;
                                self.l1_r[0] |= 1 << 31;
                            }
                        }
                    },
                    _ => {}
                }
            },

            "PlatformManager" => {
                match chunk_id {
                    _ => {}
                }
            },

            _ => {}
        }
    }
}
