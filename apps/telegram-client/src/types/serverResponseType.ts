export type ResponseData = {
    data: unknown | undefined;
}

export type ResponseError = {
    message: string
}

export type ResponseType = ResponseData | ResponseError