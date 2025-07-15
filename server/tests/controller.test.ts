const { BaseController } = require("../controllers/base-controllers");
const todos = require("../database/todo-queries");

jest.mock("../database/todo-queries");

class TestController extends BaseController {
  constructor() {
    super("test_table");
  }
}

describe("BaseController", () => {
  let controller;

  beforeEach(() => {
    controller = new TestController();
    jest.clearAllMocks();
  });

  it("should call todos.all with tableName", async () => {
    todos.all.mockResolvedValue([{ id: 1, name: "A" }]);
    const result = await controller.all();
    expect(todos.all).toHaveBeenCalledWith("test_table");
    expect(result).toEqual([{ id: 1, name: "A" }]);
  });

  it("should call todos.get with id and tableName", async () => {
    todos.get.mockResolvedValue({ id: 1, name: "A" });
    const result = await controller.get(1);
    expect(todos.get).toHaveBeenCalledWith(1, "test_table");
    expect(result).toEqual({ id: 1, name: "A" });
  });

  it("should call todos.create with entity and tableName", async () => {
    const entity = { id: 2, name: "B" };
    todos.create.mockResolvedValue(entity);
    const result = await controller.create(entity);
    expect(todos.create).toHaveBeenCalledWith(entity, "test_table");
    expect(result).toEqual(entity);
  });

  it("should call todos.update with id, properties, and tableName", async () => {
    const updated = { name: "C" };
    todos.update.mockResolvedValue({ id: 1, name: "C" });
    const result = await controller.update(1, updated);
    expect(todos.update).toHaveBeenCalledWith(1, updated, "test_table");
    expect(result).toEqual({ id: 1, name: "C" });
  });

  it("should call todos.del with id and tableName", async () => {
    todos.del.mockResolvedValue(true);
    const result = await controller.del(1);
    expect(todos.del).toHaveBeenCalledWith(1, "test_table");
    expect(result).toBe(true);
  });

  it("should call todos.clear with tableName", async () => {
    todos.clear.mockResolvedValue(undefined);
    const result = await controller.clear();
    expect(todos.clear).toHaveBeenCalledWith("test_table");
    expect(result).toBeUndefined();
  });
});
