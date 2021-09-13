module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'bootcampdeploy',
  database: 'gobarber',
  define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
  },
};