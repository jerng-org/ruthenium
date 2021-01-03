'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const s3PostPolicyTest = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )


    data.RU.signals.sendResponse.body = `
        <h3>temporary body (s3-post-policy-test.js)</h3>
        
        <h4>References:</h4>
        
        <br> - <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-UsingHTTPPOST.html">https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-UsingHTTPPOST.html</a>
        <br> - - <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTForms.html"><b>https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTForms.html</b></a>
        <br> - - <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html"><b>https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html</</a>
        <br> - - <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html"><b>https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html</b></a>
        
        <br> - <a href="https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html">https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html</a>
        <br> - <a href="https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html">https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html</a>
        <br> - <a href="https://s3.console.aws.amazon.com/s3/home?region=us-east-1#">https://s3.console.aws.amazon.com/s3/home?region=us-east-1#</a>
        <br> - <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html">https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html</a>
        
        <br> - <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-overview.html">https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-overview.html</a>
        <br> - - <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/S3_ACLs_UsingACLs.html">https://docs.aws.amazon.com/AmazonS3/latest/dev/S3_ACLs_UsingACLs.html</a>
        
        <br> - <a href="https://medium.com/@shamnad.p.s/how-to-create-an-s3-bucket-and-aws-access-key-id-and-secret-access-key-for-accessing-it-5653b6e54337"><b>https://medium.com/@shamnad.p.s/how-to-create-an-s3-bucket-and-aws-access-key-id-and-secret-access-key-for-accessing-it-5653b6e54337</b></a>
        <br> - <a href=""></a>
        <br> - <a href=""></a>
        <br> - <a href=""></a>
        <br> - <a href=""></a>
        <br> - <a href=""></a>

        <h4>POST Policy:</h4>
        <pre>
            <code id="post-policy-code-element">{ "expiration": "2021-12-30T12:00:00.000Z",
  "conditions": [
    {"bucket": "ruthenium-v1-dev"},
    {"acl": "public-read"},
    ["starts-with", "$Content-Type", "image/"],
    {"x-amz-meta-uuid": "14365123651274"},
    {"x-amz-server-side-encryption": "AES256"},
    ["starts-with", "$x-amz-meta-tag", ""],

    {"x-amz-credential": "AKIAIOSFODNN7EXAMPLE/20151229/us-east-1/s3/aws4_request"},
    {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
    {"x-amz-date": "20211229T000000Z" }
  ]
}</code>
        </pre>
        
        <h4>POST Form:</h4>
        <form action="http://sigv4examplebucket.s3.amazonaws.com/" method="post" enctype="multipart/form-data">
        
            Key to upload: 
            <input type="input"  name="key" value="user/user1/\${filename}" /><br />
            
            <input type="hidden" name="acl" value="public-read" />

            Content-Type: 
            <input type="input"  name="Content-Type" value="image/jpeg" /><br />
            
            <input type="hidden" name="x-amz-meta-uuid" value="14365123651274" /> 
            <input type="hidden" name="x-amz-server-side-encryption" value="AES256" /> 
            
            <input type="text"   name="X-Amz-Credential" value="AKIAIOSFODNN7EXAMPLE/20151229/us-east-1/s3/aws4_request" />
            <input type="text"   name="X-Amz-Algorithm" value="AWS4-HMAC-SHA256" />
            <input type="text"   name="X-Amz-Date" value="20151229T000000Z" />
        
            Tags for File: 
            <input type="input"  name="x-amz-meta-tag" value="" /><br />
            
            <input type="hidden" name="Policy" value='<Base64-encoded policy string>' />
            <input type="hidden" name="X-Amz-Signature" value="<signature-value>" />
            
            File: 
            <input type="file"   name="file" /> <br />
            
            <!-- The elements after this will be ignored -->
            
            <input type="submit" name="submit" value="Upload to Amazon S3" />
            
        </form>
    `

    rus.mark ( `~/tasks/s3-post-policy-test.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = s3PostPolicyTest
rus.mark ( `~/tasks/s3-post-policy-test.js LOADED` )