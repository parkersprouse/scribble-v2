module.exports = {

  call(promise) {
    return promise
      .then((data) => [null, data])
      .catch((err) => [err]);
  },

};
