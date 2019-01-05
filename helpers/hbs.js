module.exports = {
  list: items => {
    return items.forEach(item => {
      `<li>${item}</li>`;
    });
  }
};
