const Dokter = require('../model/dokter');
const {comparePassword} = require('../helper/bcrypt');
const {generateJWTToken} = require('../helper/jwt');
const Queue = require('../model/queue');
class DokterController {
  static registerDokter(req, res, next) {
    const {username, password, fullName} = req.body;
    Dokter.create({username, password, fullName})
        .then((dokter) => {
          res.status(201).json({_id: dokter._id, username: dokter.username});
        })
        .catch(next);
  }
  static getDokter(req, res, next) {
    const {_id} = req.params;
    Dokter.findOne({_id})
        .then((dokter) => {
          res.status(200).json({
            fullName: dokter.fullName,
            jamPraktek: dokter.jamPraktek,
            statusPraktek: dokter.statusPraktek,
            image: dokter.image,
            spesialis: dokter.spesialis,
          });
        })
        .catch(next);
  }

  static praktek(req, res, next) {
    const {status} = req.body;
    Dokter.updateOne({_id: req.decode._id}, {statusPraktek: status})
        .then((response) => {
          if (status) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            return Queue.findOne({
              created_at: {$gte: start, $lt: end},
              dokterId: req.decode._id,
            });
          }
          return;
        })
        .then((queue) => {
          if (!queue && status) {
            return Queue.create({
              dokterId: req.decode._id,
            });
          }
          return;
        })
        .then((queue) => {
          console.log(queue);
          res.status(200).json({message: 'Status praktek berhasil diganti'});
        })
        .catch(next);
  }

  static getAllDokter(req, res, next) {
    Dokter.find()
        .then((dokters) => {
          const doktersBaru = dokters.map((dokter) => {
            return {
              fullName: dokter.fullName,
              jamPraktek: dokter.jamPraktek,
              statusPraktek: dokter.statusPraktek,
              image: dokter.image,
              spesialis: dokter.spesialis,
              _id: dokter._id,
            };
          });
          res.status(200).json(doktersBaru);
        })
        .catch(next);
  }
  static refresh(req, res, next) {
    Dokter.findOne({_id: req.decode._id})
        .then((dokter) => {
          if (dokter) {
            const payload = generateJWTToken({
              _id: dokter._id,
              username: dokter.username,
            });
            res.status(200).json({
              fullName: dokter.fullName,
              token: payload,
              statusPraktek: dokter.statusPraktek,
            });
          } else {
            throw {status: 400, message: 'Dokter tidak ditemukan'};
          }
        })
        .catch(next);
  }
  static login(req, res, next) {
    const {username, password} = req.body;
    Dokter.findOne({username})
        .then((dokter) => {
          if (dokter) {
            if (comparePassword(password, dokter.password)) {
              const payload = generateJWTToken({
                _id: dokter._id,
                username: dokter.username,
              });
              res.status(200).json({
                fullName: dokter.fullName,
                token: payload,
                statusPraktek: dokter.statusPraktek,
              });
            } else {
              throw {status: 400, message: 'Username / Password anda salah'};
            }
          } else {
            throw {status: 400, message: 'Username / Password anda salah'};
          }
        })
        .catch(next);
  }
  static removeDokter(req, res, next) {
    const {_id} = req.body;
    Dokter.deleteOne({_id})
        .then((response) => {
          res.status(200).json({message: 'Berhasil menghapus dokter'});
        })
        .catch(next);
  }
}

module.exports = DokterController;
