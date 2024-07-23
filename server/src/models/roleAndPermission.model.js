const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const roleAndPermissionSchema = mongoose.Schema(
    {
      name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: false,
        default: ""
      },
      permissions: {
        type: Array,
        default: []
      },
      isDefaultRole: {
        type: Boolean,
        default: false
      },
      isSuperAdminRole: {
        type: Boolean,
        default: false
      },
      isDeleted: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true,
    }
);

roleAndPermissionSchema.plugin(toJSON);
roleAndPermissionSchema.plugin(paginate);

/**
 * @typedef RoleAndPermission
 */
const RoleAndPermission = mongoose.model('RoleAndPermission', roleAndPermissionSchema);

module.exports = RoleAndPermission;