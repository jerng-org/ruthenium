const querystring   = require ( 'querystring' )

const normalizeHeadersFormData = async ( data ) => {

    if (    data.LAMBDA.event.headers
            &&  (   data.LAMBDA.event.headers['content-type'] 
                    == 'application/x-www-form-urlencoded'
                )
    )
    {
        data.RU.request.rawFormString =
            data.LAMBDA.event.isBase64Encoded
            ?   Buffer
                    .from ( data.LAMBDA.event.body, 'base64' )
                    .toString ('utf8')
            :   data.LAMBDA.event.body
            
        data.RU.request.formStringParameters = 
            querystring.parse ( data.RU.request.rawFormString )
    }
    
    return data
}

module.exports  = normalizeHeadersFormData
const mark      = require ( '../mark' )            
mark ( `normalizeHeadersFormData.js LOADED` )