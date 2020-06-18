class ScreenshotPair:
    def __init__(self, reg_shot, small_shot):
        self.small_shot = small_shot
        self.reg_shot = reg_shot
    
    @staticmethod
    def get_pairs(shots):
        shots = sorted(shots)
        pairs = []
        i = 0

        while i < len(shots):
            if i + 1 == len(shots):
                pairs.append(ScreenshotPair(shots[i], shots[i]))
                break
            
            curr_shot = shots[i]
            next_shot = shots[i + 1]
            curr_shot_id = curr_shot.split('_')[0]
            next_shot_id = next_shot.split('_')[0]

            if curr_shot_id == next_shot_id:
                pairs.append(ScreenshotPair(curr_shot, next_shot[i + 1]))
                i += 2
            else:
                pairs.append(ScreenshotPair(curr_shot, curr_shot))
                i += 1
                
        return pairs
    
    def get_small(self):
        return self.small_shot

    def get_reg(self):
        return self.reg_shot
