import { type Request, type Response } from 'express'
import Isemail from 'isemail'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'
import HttpStatusCode from '../constants/http'
import { compareOTPWithItsHash, generateHashOTP } from '../helpers/hashOTP'
import { jwtForApp } from '../helpers/jwtForApp'
import { jwtOTPHash } from '../helpers/jwtOTPHash'
import {
  generateOTP,
  generateSendOTPTemplate,
  mailTransport
} from '../helpers/mailVerify'
import UserModel from '../models/user'
import { type IUser, type JwtOtpVerificationResponse } from '../types/user'

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user data from request body
    const { userEmail }: IUser = req.body

    // Check email format in the backend, in case frontend validation fails
    if (!Isemail.validate(userEmail)) {
      res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
        msg: 'El e-mail no es válido, por favor, revisar.',
        success: false
      })
      return
    }

    // Check if user already exists in the database
    const userExists = await UserModel.findOne({
      userEmail
    })
    if (userExists === null) {
      const newUser = new UserModel(req.body)
      await newUser.save()
    }

    // We need to get the ID of the user that we just created or from an existing one
    const userFromDB = await UserModel.findOne({ userEmail })

    // Generate a new OTP and send it via email
    const OTP = generateOTP()
    mailTransport(
      'Necesita ingresar este código para usar la APP',
      userEmail,
      generateSendOTPTemplate(OTP)
    )

    // Generate a hash of the OTP and create a JWT containing the hash
    const hashOTP = generateHashOTP(OTP)
    const tokenOTP = await jwtOTPHash(hashOTP)

    // Return a success response with the user's email and the token containing the OTP
    res.status(HttpStatusCode.CREATED).json({
      msg: 'Código entregado con éxito',
      success: true,
      userId: userFromDB?._id,
      token: tokenOTP
    })
  } catch (error) {
    // Return an error response if user creation fails
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ msg: 'No se pudo crear el usuario.', success: false })
  }
}

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID, OTP, and token from request body
    const { userId, otp, token } = req.body

    // Validate user ID and OTP
    if (userId === '' || otp.trim().length === 0) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ msg: 'Solicitud inválida.', success: false })
      return
    }

    if (!isValidObjectId(userId)) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ msg: 'userId inválido.', success: false })
      return
    }

    // Check if user exists in the database
    const user = await UserModel.findById(userId)
    if (user === null) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ msg: 'Usuario no encontrado.', success: false })
      return
    }

    // Validate the OTP using the token containing its hash
    const { otpHash } = jwt.verify(
      token,
      process.env.SECRET_KEY_OTP_JWT as string
    ) as JwtOtpVerificationResponse

    const isMatched = compareOTPWithItsHash(otp, otpHash)
    if (!isMatched) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ msg: 'Código inválido.', success: false })
      return
    }

    // Generate a token for app access and return it with user ID
    if (user !== null) {
      const appToken = await jwtForApp(userId)
      res.status(HttpStatusCode.CREATED).json({
        userEmail: user?.userEmail,
        token: appToken,
        msg: 'Bienvenid@. Autenticación exitosa.'
      })
    }
  } catch (error) {
    // If the token is not valid or missing, send an error response to the client
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        msg: 'Su código ha expirado, por favor, solicite uno nuevo.'
      })
    } else {
      // Return an error response if the verification of the email fails
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        msg: 'No se pudo validar el email. Solicite un nuevo código.',
        success: false
      })
    }
  }
}

export { createUser, verifyEmail }
