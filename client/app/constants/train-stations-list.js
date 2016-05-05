'use strict';

angular.module('officeManagementApp')
    .run(function (AppConstant) {
        AppConstant['TRAIN_STATION_LIST'] = {
            BTS: [
                { code: 'CEN', name: 'Siam' },
                { code: 'N01', name: 'Ratchathewi' },
                { code: 'N02', name: 'Phaya Thai' },
                { code: 'N03', name: 'Vistory Monument' },
                { code: 'N04', name: 'Sanam Pao' },
                { code: 'N05', name: 'Ari' },
                { code: 'N07', name: 'Saphan Khwai' },
                { code: 'N08', name: 'Mo Chit' },
                { code: 'E01', name: 'Chit Lom' },
                { code: 'E02', name: 'Phloen Chit' },
                { code: 'E03', name: 'N0ana' },
                { code: 'E04', name: 'Asok' },
                { code: 'E05', name: 'Phrom Phong' },
                { code: 'E06', name: 'Thong Lo' },
                { code: 'E07', name: 'Ekkamai' },
                { code: 'E08', name: 'Phra Khanong' },
                { code: 'E09', name: 'On Nut' },
                { code: 'E10', name: 'Bang Chak' },
                { code: 'E11', name: 'Punnawithi' },
                { code: 'E12', name: 'Udom Suk' },
                { code: 'E13', name: 'Bang Na' },
                { code: 'E14', name: 'Bearing' },
                { code: 'S01', name: 'Ratchadamri' },
                { code: 'S02', name: 'Sala Daeng' },
                { code: 'S03', name: 'Chong Nonsi' },
                { code: 'S05', name: 'Surasak' },
                { code: 'S06', name: 'Saphan Taksin' },
                { code: 'S07', name: 'Krung Thon Buri' },
                { code: 'S08', name: 'Wongwian Yai' },
                { code: 'S09', name: 'Pho Nimit' },
                { code: 'S10', name: 'Talat Phlu' },
                { code: 'S11', name: 'Wutthakat' },
                { code: 'S12', name: 'Bang Wa' },
                { code: 'W01', name: 'National Stadium' }
            ],
            MRT: [
                { code: 'TAO', name: 'Tao Poon' },
                { code: 'BAN', name: 'Bang Sue' },
                { code: 'KAM', name: 'Kamphaeng Phet' },
                { code: 'CHA', name: 'Chatuchak Park' },
                { code: 'PHA', name: 'Phahon Yothin' },
                { code: 'LAT', name: 'Lat Phrao' },
                { code: 'RAT', name: 'Ratchadaphisek' },
                { code: 'SUT', name: 'Sutthisan' },
                { code: 'HUI', name: 'Huai Khwang' },
                { code: 'CUL', name: 'Thailand Cultural Centre' },
                { code: 'RAM', name: 'Phra Ram 9' },
                { code: 'PET', name: 'Phetchaburi' },
                { code: 'SUK', name: 'Sukhumvit' },
                { code: 'SIR', name: 'Queen Sirikit National Convention Centre' },
                { code: 'KHO', name: 'Khlong Toei' },
                { code: 'LUM', name: 'Lumphini' },
                { code: 'SIL', name: 'Si Lom' },
                { code: 'SAM', name: 'Sam Yan' },
                { code: 'HUA', name: 'Hua Lamphong' }
            ]
        };
    });
