module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      categoryId: DataTypes.INTEGER
    },
    {}
  );
  Post.associate = models => {
    // associations can be defined here
    Post.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    });
  };
  return Post;
};
