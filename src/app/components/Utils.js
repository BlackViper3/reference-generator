const createAuthorsList = (authors) => {
    let singleAuthor = true;
    let authorString = "";
    

    if (authors.length === 0) {
        authorString = "Anon";
    }

    for (const author of authors) {
        
        if (!singleAuthor) authorString += " and ";
        singleAuthor = false;

        if (!author.family && !author.given) {
            authorString += author.literal;
        } else if (author.family) {
            authorString += author.family + ",";
            if (author.given) {
                authorString += author.given.charAt(0) + ".";
            }
        } else {
            authorString = "Anon";
        }
    }
    return authorString;
}

export { createAuthorsList };