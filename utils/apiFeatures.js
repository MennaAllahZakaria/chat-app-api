
class ApiFeatures{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter(){
        // delete unwanted fields
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const querystringObj={... this.queryString}
    const excludesFiles=["page","sort","limit","fields"];
    excludesFiles.forEach((val)=>delete querystringObj[val]);

    //applay filtering using (gt | gte | lt |lte)
    let queryStr=JSON.stringify(querystringObj);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    
    this.mongooseQuery=this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
    }

    sort(){
        if ( this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.mongooseQuery=this.mongooseQuery.sort(sortBy)
        }else{
            this.mongooseQuery=this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        if (this.queryString.fields){
            const fields=this.queryString.fields.split(',').join(' ');
            this.mongooseQuery=this.mongooseQuery.select(fields)
        }else{
            this.mongooseQuery=this.mongooseQuery.select('-__v')
        }
        return this;
    }

    search(modelName){
        if (this.queryString.keyword){
            let query={};
            if (modelName==="Product"){
                query.$or=[
                    {title:{$regex:this.queryString.keyword,$options:'i'}},
                    {description:{$regex:this.queryString.keyword,$options:'i'}},
                ];
            }else{
                query={name:{$regex:this.queryString.keyword,$options:'i'}}
                
            }
            
            this.mongooseQuery=this.mongooseQuery.find(query);
        }
        return this;

    }


    pagenate(countDocuments){
        const page =this.queryString.page*1||1;
        const limit =this.queryString.limit*1|| 50;
        const skip= ( page-1)*limit;
        const endIndex=page*limit;

        const pagenation={};
        pagenation.currentPage=page;
        pagenation.limit=limit;
        pagenation.numberOfPages=Math.ceil( countDocuments/limit);
        
        if (endIndex<countDocuments){
            pagenation.nextPage=page+1;
        }

        if ( skip>0){
            pagenation.prevPage=page-1;
        }
        this.mongooseQuery=this.mongooseQuery
                                    .skip(skip)
                                    .limit(limit);

        this.pagenationResult=pagenation;
        return this;

    }

}

module.exports=ApiFeatures;