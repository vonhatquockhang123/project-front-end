function Banner(props)
{
    return (
       <>
        {
          props.member.id === 1 && (
            <div className="carousel-item active">
              <img src={`http://localhost:8000/${props.member.img_url}`} className="d-block w-50" alt="..." />
            </div>
          )
        }
        {
          props.member.id === 2 && (
            <img src={`http://localhost:8000/${props.member.img_url}`} className="banner" alt="..."/>
          )
        }
        {
          props.member.id === 3 && (
            <img src={`http://localhost:8000/${props.member.img_url}`} className="banner1" alt="..."/>
          )
        }
        </>
      )
}

export default Banner;