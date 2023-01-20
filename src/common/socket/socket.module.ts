import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [UserModule],
    providers: [SocketService]
})

export class SocketModule { }