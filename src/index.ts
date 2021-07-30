import { Application, Request, Response } from 'express'
import 'reflect-metadata'
import { createConnection, getCustomRepository } from 'typeorm'
import { UserRepository } from './repositories/user.repository'
import * as jwt from 'jsonwebtoken'
import { User } from './entity/user.entity'
import * as express from 'express'
import { loginDto } from './dtos/login.dto'
import { RefreshTokenRepository } from './repositories/refresh-token.repository'
import { Food } from './entity/food.entity'
import { FoodRepository } from './repositories/food.repository'
import { json, urlencoded } from 'body-parser'
import * as multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { CheckTokenData } from './class/check-access.class'
import * as bcrypt from 'bcrypt'

const app: Application = express()

app.use(urlencoded({ extended: true, limit: '50mb' }))
app.use(json({ limit: '50mb' }))

const storage = multer.diskStorage({
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, './uploads/')
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    callback(null, uuidv4() + '_' + file.originalname)
  },
})
var upload = multer({ storage })

createConnection()

async function checkAccessToken(accessToken: string) {
  const returnData = new CheckTokenData()
  returnData.status = true
  let jwtData = null
  try {
    jwtData = jwt.verify(accessToken, process.env.JWT_KEY)
    const refreshTokenData = await getCustomRepository(
      RefreshTokenRepository,
    ).findOne({ refreshToken: jwtData.refreshToken })
    if (!refreshTokenData) {
      returnData.status = false
      returnData.message = 'refreshToken not found'
    }
    const dateNow = new Date()
    if (dateNow > refreshTokenData.expire) {
      returnData.status = false
      returnData.message = 'refreshToken expire'
    }
    refreshTokenData.expire.setDate(new Date().getDate() + 1)
  } catch {
    returnData.status = false
    returnData.message = 'invalid accessToken'
  }
  returnData.data = jwtData
  return returnData
}

app.get('/allUser', async (req: Request, res: Response) => {
  const users = await getCustomRepository(UserRepository).find()
  if (users.length === 0) return res.send('User not found')
  res.send(users)
})

app.post('/register', async (req: Request, res: Response) => {
  const user = new User()
  user.username = req.body['username']
  user.password = req.body['password']
  user.name = req.body['name']
  user.email = req.body['email']
  user.tel = req.body['tel']
  user.type = 'user'

  const userDB = await getCustomRepository(UserRepository).findOne({
    username: user.username,
  })
  if (userDB)
    return res.send({
      message: 'User already in use',
      status: false,
    })

  user.password = await bcrypt.hash(user.password, 10)
  await getCustomRepository(UserRepository).save(user)
  res.send({
    status: true,
    message: 'success',
  })
})

app.post('/login', async (req: Request, res: Response) => {
  const data = new loginDto()
  data.username = req.body['username']
  data.password = req.body['password']
  const user = await getCustomRepository(UserRepository).findOne({
    username: data.username,
  })
  if (!user)
    return res.send({
      status: false,
      message: 'User not found',
    })
  const isMath = await bcrypt.compare(data.password, user.password)
  if (!isMath)
    res.send({
      status: false,
      message: 'Incorrect password',
    })
  const refreshToken = uuidv4()
  const accessToken = await jwt.sign(
    {
      userId: user.userId,
      refreshToken,
    },
    process.env.JWT_KEY,
  )
  const date = new Date()
  date.setDate(date.getDate() + 1)
  await getCustomRepository(RefreshTokenRepository).save({
    refreshToken,
    expire: date,
  })
  res.send({
    status: true,
    data: {
      accessToken,
      username: user.username,
      userType: user.type,
      userId: user.userId,
    },
  })
})

app.post('/check', async (req: Request, res: Response) => {
  const accessToken = req.body['accessToken']
  const jwtData = await checkAccessToken(accessToken)
  res.send(jwtData)
})

app.post(
  '/addFood',
  upload.single('pic'),
  async (req: Request, res: Response) => {
    const imageFile: Express.Multer.File = req.file
    const food = new Food()
    food.name = req.body['foodName']
    food.price = req.body['foodPrice']
    food.typeId = req.body['foodTypeId']
    food.img = imageFile.path
    await getCustomRepository(FoodRepository).save(food)
    res.send(true)
  },
)

app.listen(process.env.PORT || 4000)
