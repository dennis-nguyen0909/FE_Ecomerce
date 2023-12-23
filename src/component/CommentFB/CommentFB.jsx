import React from 'react'

export const CommentFB = ({ dataHref, width }) => {
    return (
        <div style={{ margin: '10px 0' }}>
            <div className="fb-comments" data-href={dataHref}
                data-width={width} data-numposts="5"></div>
        </div>
    )
}
