import React from 'react'

export const LikeButtonComentFB = ({ dataHref }) => {
    return (
        <div style={{ margin: '10px 0' }}>

            <div className="fb-like" data-href={dataHref} data-width="" data-layout=""
                data-action="" data-size="" data-share="true"></div>
        </div>
    )
}
