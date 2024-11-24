//reduce text length(truncateing)
export const TruncateText = (str) => {
    if (str.length <= 25) {
        return str;
    }
    return str.substring(0, 25) + "...";
};


