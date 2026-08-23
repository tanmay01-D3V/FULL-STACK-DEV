const serviceModel = require("../models/services");

function parseServicePayload(body) {
  const { name, description, price, duration_minutes } = body;
  const fields = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) return null;
    fields.name = name.trim();
  }
  if (description !== undefined) fields.description = description;
  if (price !== undefined) {
    const num = Number(price);
    if (Number.isNaN(num) || num < 0) return null;
    fields.price = num;
  }
  if (duration_minutes !== undefined) {
    const num = Number(duration_minutes);
    if (!Number.isInteger(num) || num <= 0) return null;
    fields.duration_minutes = num;
  }

  return fields;
}

async function getAll(req, res) {
  const services = await serviceModel.getAllServices();
  res.status(200).json({ count: services.length, data: services });
}

async function getOne(req, res) {
  const service = await serviceModel.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ data: service });
}

async function create(req, res) {
  const fields = parseServicePayload(req.body);
  if (!fields || !fields.name || fields.price === undefined) {
    return res
      .status(400)
      .json({ message: "name and price are required and must be valid" });
  }

  const service = await serviceModel.createService(fields);
  res.status(201).json({ message: "Service created", data: service });
}

async function update(req, res) {
  const fields = parseServicePayload(req.body);
  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const service = await serviceModel.updateService(req.params.id, fields);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ message: "Service updated", data: service });
}

async function remove(req, res) {
  const service = await serviceModel.deleteService(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ message: "Service deleted", data: service });
}

module.exports = { getAll, getOne, create, update, remove };
