import debug from 'debug';
import mongoose from 'mongoose';

const log = debug('smooth:log');
const Schema = mongoose.Schema;

const ensure = (data, errMessage) => {
  if (!data) throw new Error(errMessage);
};

export default class Smooth {
  constructor (schema, options) {
    /*
     * Constructor of Smooth Object
     * @param{JSON} schema Mongoose Schema of the Object
     * @param{JSON} options Options provided by user
     *  @param{JSON} privilege
     *    @param{Function} C
     *    @param{Function} R
     *    @param{Function} U
     *    @param{Function} D
     */
    log(`Dealing with schema ${schema}\nOptions: ${options}`);

    this.options = {
      privilege: {
        C () {
          return true;
        },
        R () {
          return true;
        },
        U () {
          return true;
        },
        D () {
          return true;
        }
      }
    };
    
    for (var key in options) {
      this.options[key] = options[key];
    }

    ensure(this.options.mongooseAddr, 'ENOADDR');
    ensure(this.options.name, 'ENONAME');

    mongoose.connect(this.options.mongooseAddr);

    this.schema = new Schema(schema);
    this.Mongoose = mongoose.model(this.options.name, this.schema);
  }

  register (app, path) {
    /*
     * Register function
     * @param{Express App} app Express App for binding usage
     * @param{String} path Prefix path for routing
     */
    log(`Registering smooth Object to ${path}`);
    
    app.post(`${path}/get`, this.routerGet.bind(this));
    app.post(`${path}/getOne`, this.routerGetOne.bind(this));
    app.post(`${path}/remove`, this.routerRemove.bind(this));
    app.post(`${path}/update`, this.routerUpdate.bind(this));
  }

  checkPrivilege (priv, req) {
    return this.options.privilege[priv](req);
  }

  routerGet (req, res) {
    /*
     * Read support for CRUD
     * @param{Express Request} req
     * @param{Express Response} res
     */
    if (!this.checkPrivilege('R', req)) {
      return;
    }

    this.Mongoose.find({}, (err, doc) => {
      this.result(doc, req, res);
    });
  }

  routerGetOne (req, res) {
    /*
     * ReadOne support for CRUD
     * @param{Express Request} req
     * @param{Express Response} res
     */
    if (!this.checkPrivilege('R'), req) {
      return;
    }

    this.Mongoose.findOne({_id: req.body._id}, (err, doc) => {
      this.result(doc, req, res);
    });
  }

  routerRemove (req, res) {
    /*
     * Delete support for CRUD
     * @param{Express Request} req
     * @param{Express Response} res
     */
    if (!this.checkPrivilege('D'), req) {
      return;
    }

    this.Mongoose.remove({_id: req.body._id}, (err, doc) => {
      this.result(doc, req, res);
    });
  }

  routerUpdate (req, res) {
    /*
     * Update support for CRUD
     * @param{Express Request} req
     * @param{Express Response} res
     */
    if (!this.checkPrivilege('U'), req) {
      return;
    }

    this.Mongoose.update({_id: req.body._id}, req.body.upd, (err, doc) => {
      this.result(doc, req, res);
    });
  }
}

