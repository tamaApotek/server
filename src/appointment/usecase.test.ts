import usecase from "./usecase";

describe("AppointmentUsecase", () => {
  describe("common action", () => {
    test.todo("find list doctor");
    test.todo("find doctor's schedule");
  });

  describe("patient action", () => {
    test.todo("patient register for an appointment");
    test.todo("patient cancel an appointment");
  });

  describe("admin action", () => {
    test.todo("admin get list of doctor queue by date");
    test.todo("admin confirm patient's queue");
    test.todo("admin add manual queue item");
    test.todo("admin call next queue patient");
    test.todo("admin delay called patient");
    test.todo("admin call delayed patient");
  });
});
