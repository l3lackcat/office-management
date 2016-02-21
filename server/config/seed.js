/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Building from '../api/building/building.model';
import Room from '../api/room/room.model';
import User from '../api/user/user.model';

Room.find({}).removeAsync();
Building.find({}).removeAsync()
  .then(() => {
    Building.create({
      name: '208 WIRELESS ROAD BUILDING',
      area: 'Ploenchit'
    }, function (err, building) {
      Room.create({
        building: building._id,
        unit: '103',
        floor: 'G',
        space: 651.59,
        price: 2000,
        type: 'Retail',
        status: 'Y'
      }, {
        building: building._id,
        unit: '201',
        floor: '2',
        space: 317.52,
        price: 840,
        type: 'Office',
        status: 'Y'
      }, {
        building: building._id,
        unit: '301',
        floor: '3',
        space: 1083.01,
        price: 840,
        type: 'Office',
        status: 'Y'
      }, {
        building: building._id,
        unit: '401',
        floor: '4',
        space: 1083.01,
        price: 840,
        type: 'Office',
        status: 'Y'
      }, {
        building: building._id,
        unit: '1602',
        floor: '16',
        space: 277.85,
        price: 840,
        type: 'Office',
        status: 'Y'
      }, {
        building: building._id,
        unit: '1701-2',
        floor: '17',
        space: 674.87,
        price: 840,
        type: 'Office',
        status: 'Y'
      });
    });

    Building.create({
      name: '#Individual',
      area: 'Ekkamai'
    }, function (err, building) {
      Room.create({
        building: building._id,
        space: 800,
        type: 'Office',
        status: 'Y',
        remark: 'เนื้อที่ 800 ตารางเมตร 4 ชั้น พร้อมที่จอดรถ ราคาเช่า 250,000 บาทต่อเดือน'
      });
    });
  });

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
