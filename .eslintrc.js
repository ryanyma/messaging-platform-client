module.exports = {
    extends: ["airbnb", "airbnb/hooks", "plugin:prettier/recommended"],
    globals: {
      "document": true
    },
    rules: {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-props-no-spreading": [1, { "extensions": [".js", ".jsx"] }]
    },
    parser: "babel-eslint",
    env: {
      browser: 1
    }
}
