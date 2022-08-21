module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0326e5afe715ca6d49e297fbec6f482c'),
  },
});
