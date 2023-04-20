export default function CategoryList(props) {

  var earlyPrompt = {};
  var earlyNegativePrompt = {};

  function handle(e) {
    earlyPrompt[e.target.getAttribute('data-sub-category')] = e.target.getAttribute('data-prompt');
    earlyNegativePrompt[e.target.getAttribute('data-sub-category')] = e.target.getAttribute('data-negative-prompt');

    props.setPrompt(earlyPrompt);
    props.setNegativePrompt(earlyNegativePrompt);
  }

  const returnCategory = (category) => {
    category = Object.entries(category);  //[subCategory(Array), subCategory(Array)]

    return (
      <div>
        {category ? category.map((c, key) => //['subCategoryName', subCategoryItems(Array)]
          <div key={key}>

            {/* Sub Menu Button */}
            <div className="cursor-default flex items-center justify-center p-4 my-8 text-white text-center w-full rounded-lg bg-opacity-30 bg-white"
              key={c[0]}>
              {c[0]}</div>

            {/* Sub Menu Items*/}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {c[1].map((e, key) => //{"name": "Name", "image": "url", "prompt": "prompt", "negativePrompt": "negative prompt"}
                <img className="rounded-lg h-24 cursor-pointer"
                  key={key}
                  alt={e.name}
                  src={e.image}
                  data-sub-category={c[0]}
                  data-prompt={e.prompt}
                  data-negative-prompt={e.negativePrompt}
                  onClick={e => handle(e)} tabIndex={key}></img>)}
            </div>

          </div>
        ) : null}
      </div>
    )
  }

  return (
    returnCategory(props.category)
  )
}
