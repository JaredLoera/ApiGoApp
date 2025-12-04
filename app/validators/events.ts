import vine from "@vinejs/vine";

export const EventValidator = vine.compile(
  vine.object({
    reportreportId: vine.number().min(1),
    reportStatusId: vine.number().min(1),
    description: vine.string().minLength(10).maxLength(500),
  })
);