

export type RpcErrorCode = 
| 'BAD_REQUEST'
| 'NOT_FOUND'
| 'UNAUTHORIZED'
| 'FORBIDDEN'
| 'INTERNAL'



export type RpcErrorPayload ={
    code:RpcErrorCode,
    message:string,
    details?: any
}
