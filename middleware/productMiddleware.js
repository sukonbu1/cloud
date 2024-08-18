// Middleware function to update the updatedAt field before saving the document
function updateTimestampOnSave(next) {
  this.updatedAt = Date.now();
  next();
}

// Middleware function to update updatedAt field when the document is updated
function updateTimestampOnUpdate(next) {
  this.set({ updatedAt: Date.now() });
  next();
}

module.exports = {
  updateTimestampOnSave,
  updateTimestampOnUpdate,
};
