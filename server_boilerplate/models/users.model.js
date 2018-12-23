const userType = {
  'admin': 'admin',
  'user': 'user',
  'superadmin': 'superadmin'
};

module.exports = (args) => {
  const { sequelize, DataTypes } = args;

  let Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Field should be not empty'
        },
        isEmail: {
          msg: 'Field should be email'
        }
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      field: 'role_id'
    },
    name: {
      type: DataTypes.STRING(255)
    },
    lastName: {
      type: DataTypes.STRING(255),
      field: 'last_name'
    },
    address: {
      type: DataTypes.STRING(255)
    },
    address2: {
      type: DataTypes.STRING(255)
    },
    city: {
      type: DataTypes.STRING(255)
    },
    country: {
      type: DataTypes.STRING(255)
    },
    zipCode: {
      type: DataTypes.STRING(255),
      field: 'zip_code'
    },
    contact: {
      type: DataTypes.STRING(255)
    },
    gender: {
      type: DataTypes.STRING(10)
    },
    status: {
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Field should be not empty'
        }
      }
    },
    wallet: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    walletReferral: {
      type: DataTypes.STRING(255),
      field: 'wallet_referral'
    },
    clickId: {
      type: DataTypes.STRING(50),
      field: 'click_id'
    },
    tokensAmount: {
      type: DataTypes.DECIMAL,
      field: 'tokens_amount'
    },
    ethContrib: {
      type: DataTypes.DECIMAL,
      field: 'eth_contrib'
    },
    btcContrib: {
      type: DataTypes.DECIMAL,
      field: 'btc_contrib'
    },
    ltcContrib: {
      type: DataTypes.DECIMAL,
      field: 'ltc_contrib'
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      field: 'reset_password_token'
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      field: 'reset_password_expires'
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      field: 'verification_token'
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      field: 'verification_token_expires'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    scopes: {
      get: {
        include: [
          {
            model: sequelize.models.wallets,
            as: 'wallets'
          }
        ],
        attributes: [
          'id', 'email', 'name', 'wallet', 'walletReferral', 'lastName', 'address', 'address2',
          'city', 'country', 'zipCode', 'contact', 'gender', 'clickId',
          'tokensAmount', 'ethContrib', 'btcContrib', 'ltcContrib'
        ]
      }
    }
  });

  Users.getDefaultRole = () => {
    const name = userType.user;

    return sequelize.models.roles.findOne({ where: { name } })
      .then(role => {

        if (!role) {
          return {};
        }

        return role;
      });
  };

  Users.prototype.getRoleName = function() {
    let role = this.get('role');
    return role && role.get('name');
  };

  Users.prototype.isAdmin = function() {
    return this.getRoleName() === userType.admin;
  };

  Users.prototype.isSuperAdmin = function() {
    return this.getRoleName() === userType.superadmin;
  };

  return Users;
};
