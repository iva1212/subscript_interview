import { BaseController } from "../controllers/base-controllers";

export class BaseRoutes<T> {
  routes: any;
  constructor(private controller: BaseController<T>, private suffix: string) {}

  async all(req, res) {
    const allEntries = await this.controller.all();
    return res.send(allEntries);
  }

  async get(req, res) {
    const entry = await this.controller.get(req.params.id);
    return res.send(entry);
  }
  async create(req, res) {
    const createdEntry = await this.controller.create(req.body);
    return res.status(201).send(createdEntry);
  }
  async update(req, res) {
    const updatedEntry = await this.controller.update(req.params.id, req.body);
    return res.send(updatedEntry);
  }
  async del(req, res) {
    const deletedEntry = await this.controller.del(req.params.id);
    return res.send(deletedEntry);
  }
  async clear(req, res) {
    const clearedEntries = await this.controller.clear();
    return res.send(clearedEntries);
  }

  addErrorReporting(func: (req, res) => any, message: string) {
    return async function (req, res) {
      try {
        return await func(req, res);
      } catch (err) {
        console.log(`${message} caused by: ${err}`);

        // Not always 500, but for simplicity's sake.
        res.status(500).send(`Opps! ${message}.`);
      }
    };
  }

  getRoutes() {
    const toExport = [
      {
        name: "all",
        method: this.all.bind(this),
        errorMessage: "Could not fetch all entries",
        suffix: `/${this.suffix}/`,
        httpMethod: "get",
      },
      {
        name: "get",
        method: this.get.bind(this),
        errorMessage: "Could not fetch entry",
        suffix: `/${this.suffix}/:id`,
        httpMethod: "get",
      },
      {
        name: "create",
        method: this.create.bind(this),
        errorMessage: "Could not create entry",
        suffix: `/${this.suffix}/`,
        httpMethod: "post",
      },
      {
        name: "update",
        method: this.update.bind(this),
        errorMessage: "Could not update entry",
        suffix: `/${this.suffix}/:id`,
        httpMethod: "put",
      },
      {
        name: "del",
        method: this.del.bind(this),
        errorMessage: "Could not delete entry",
        suffix: `/${this.suffix}/:id`,
        httpMethod: "delete",
      },
      {
        name: "clear",
        method: this.clear.bind(this),
        errorMessage: "Could not clear entries",
        suffix: `/${this.suffix}/clear`,
        httpMethod: "delete",
      },
    ];

    return toExport;
  }
}
