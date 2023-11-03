export enum MSGS_RESPONSES {
  DB_CONNECTED = 'Database connected 🔥🔥🔥',
  DB_CONNECTION_PROBLEM = '😒😒😒 connection refused!!!',
  GET_TODOS_USER_CHECK = 'No se pueden encontrar las tareas de un usuario que no existe.',
  GET_TODOS_OK = 'Búsqueda exitosa de las tareas.',
  GET_TODOS_ERROR = 'Error al traer todas las tareas del usuario.',
  ADD_TODO_USER_CHECK = 'No se puede añadir una tarea de un usuario que no existe.',
  ADD_TODO_OK = 'Tarea agregada.',
  ADD_TODO_ERROR = 'Error al crear una tarea.',
  UPDATE_TODO_USER_CHECK = 'No se puede actualizar una tarea de un usuario que no existe.',
  UPDATE_TODO_CHECK_EXISTENCE = 'No se puede actualizar una tarea que no existe.',
  UPDATE_TODO_OK = 'Tarea actualizada.',
  UPDATE_TODO_ERROR = 'Error al actualizar una tarea.',
  DELETE_TODO_USER_CHECK = 'No se puede eliminar una tarea de un usuario que no existe.',
  DELETE_TODO_CHECK_EXISTENCE = 'No se puede eliminar una tarea que no existe.',
  DELETE_TODO_OK = 'Tarea borrada.',
  DELETE_TODO_ERROR = 'Error al borrar una tarea.',
  DELETE_COMPLETED_TODOS_USER_CHECK = 'No se pueden eliminar las tareas completadas de un usuario que no existe.',
  DELETE_COMPLETED_TODOS_CHECK_EXISTENCE = 'No se pueden eliminar tareas que no existen.',
  DELETE_COMPLETED_TODOS_OK = 'Tareas borradas.',
  DELETE_COMPLETED_TODOS_ERROR = 'Error al borrar las tareas completadas.',
  USER_EMAIL_NOT_VALID = 'El e-mail no es válido, por favor, revisar.',
  USER_OTP_MAILTRANSPORT_MSG = 'Necesita ingresar este código para usar la APP',
  USER_OTP_DELIVERED = 'Código entregado con éxito.',
  USER_ERROR = 'No se pudo crear el usuario.',
  VERIFY_EMAIL_INVALID_REQ = 'Solicitud inválida.',
  VERIFY_EMAIL_INVALID_USER = 'userId inválido.',
  VERIFY_EMAIL_USER_NOT_FOUND = 'Usuario no encontrado.',
  VERIFY_EMAIL_INVALID_OTP = 'Código inválido.',
  VERIFY_EMAIL_OK = 'Bienvenid@. Autenticación exitosa.',
  VERIFY_EMAIL_JWT_ERROR = 'Su código ha expirado, por favor, solicite uno nuevo.',
  VERIFY_EMAIL_ERROR = 'No se pudo validar el email. Error en el servidor.',
  JWT_FOR_APP_ERROR1 = 'Error al generar token para la App',
  JWT_FOR_APP_ERROR2 = 'El token de la app es undefined',
  JWT_OTP_HASH_ERROR1 = 'Error al generar token para el OTP',
  JWT_OTP_HASH_ERROR2 = 'El token del OTP Hash es undefined',
  MIDDLEWARE_NO_TOKEN = 'No hay token en la petición.',
  MIDDLEWARE_EXPIRED_TOKEN = 'Su sesión ha expirado, por favor, inicie sesión nuevamente.',
  MIDDLEWARE_INVALID_TOKEN = 'Token no válido.',
  TODO_USER_ID_REQUIRED = 'Se requiere el ID del usuario',
  TODO_MODEL_TITLE = 'Se requiere el título de la tarea',
  TODO_MODEL_COMPLETED = 'Se requiere el estado de la tarea',
  USER_MODEL_USEREMAIL = 'Se requiere el correo del usuario',
  TODO_MODEL_DEADLINE = 'Se requiere la fecha tope de la tarea',
  TAG_MODEL_NAME_REQUIRED = 'Se requiere el nombre de la etiqueta',
  TAG_MODEL_COLOR_REQUIRED = 'Se requiere el color de la etiqueta',
  TAG_CREATED = 'Etiqueta creada con éxito',
  TAG_SAVE_ERROR = 'Error al crear la etiqueta',
  TAG_MODEL_COLOR_INVALID = 'El color de la etiqueta no es válido',
  TAG_MODEL_NAME_TOO_SHORT = 'El nombre de la etiqueta es demasiado corto',
  TAG_MODEL_NAME_TOO_LARGE = 'El nombre de la etiqueta es demasiado largo',
  TAGS_FETCHED = 'Etiquetas obtenidas con éxito',
  TAGS_EMPTY = 'No hay etiquetas para este usuario',
  TAGS_FETCH_ERROR = 'Error al obtener las etiquetas',
  USER_NOT_FOUND = 'Usuario no encontrado',
  TAG_DELETED = 'Etiqueta eliminada con éxito',
  TAG_DELETE_ERROR = 'Error al eliminar la etiqueta',
  TAG_NOT_FOUND = 'Etiqueta no encontrada',
  TAG_UPDATED = 'Etiqueta actualizada con éxito',
  TAG_UPDATE_ERROR = 'Error al actualizar la etiqueta',
  TAG_NAME_ALREADY_EXISTS = 'Ya existe una etiqueta con ese nombre',
  TAG_COLOR_ALREADY_EXISTS = 'Ya existe una etiqueta con ese color',
  TOKEN_EXPIRED = 'El token ha expirado',
  INTERNAL_SERVER_ERROR = 'Error en el servidor'
}

export enum Priorities {
  high = 'high',
  medium = 'medium',
  low = 'low'
}
