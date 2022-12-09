
//This is where we will get the information do display on the cards
const reviews = [
    {
        username: "Example 1",
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        footer: "06/11/2022"
    },
    {
        username: "Example 2",
        message: `Vitae aliquet nec ullamcorper sit amet. Odio tempor orci dapibus ultrices in iaculis. Integer malesuada nunc vel risus commodo. Aenean pharetra magna ac 
                  placerat vestibulum lectus. Urna porttitor rhoncus dolor purus non enim. Dignissim enim sit amet venenatis urna cursus eget nunc scelerisque. In nisl nisi scelerisque 
                  eu. Ac turpis egestas integer eget aliquet nibh. Lectus proin nibh nisl condimentum. Auctor augue mauris augue neque gravida in fermentum. Eleifend mi in nulla posuere 
                  sollicitudin. Nunc sed blandit libero volutpat.`,
        footer: "02/02/2022"
    },
    {
        username: "Example 3",
        message: `Arcu dictum varius duis at consectetur lorem donec. Posuere urna nec tincidunt praesent. Lorem sed risus ultricies tristique nulla aliquet enim. Blandit massa enim nec 
                  dui nunc. Porttitor eget dolor morbi non arcu. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a. Ultricies integer quis auctor elit sed. Sem fringilla ut morbi
                  tincidunt augue interdum velit. Massa eget egestas purus viverra accumsan in. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Dignissim cras 
                  tincidunt lobortis feugiat vivamus at.`,
        footer: "08/08/2022"
    },
    {
        username: "Example 4",
        message: `A condimentum vitae sapien pellentesque habitant morbi tristique senectus. Neque sodales ut etiam sit amet nisl purus in mollis. Aliquam vestibulum morbi blandit cursus 
                  risus at ultrices mi. Faucibus pulvinar elementum integer enim neque volutpat ac. Luctus venenatis lectus magna fringilla urna porttitor rhoncus. Auctor augue mauris augue neque 
                  gravida in fermentum et sollicitudin. A iaculis at erat pellentesque adipiscing commodo elit at. Purus semper eget duis at tellus at.`,
        footer: "14/10/2021"
    },
    {
        username: "Example 5",
        message: `Ac turpis egestas maecenas pharetra convallis posuere. Consectetur adipiscing elit pellentesque habitant morbi. Morbi tempus iaculis urna id volutpat lacus laoreet. 
                  Pharetra magna ac placerat vestibulum lectus mauris ultrices eros in. Et malesuada fames ac turpis. Aliquam ultrices sagittis orci a scelerisque. Facilisi nullam vehicula ipsum a 
                  arcu cursus vitae congue mauris. Scelerisque purus semper eget duis at tellus at urna. Eros donec ac odio tempor orci dapibus ultrices in iaculis.`,
        footer: "19/6/2020"
    },
    {
        username: "Example 6",
        message: `Purus semper eget duis at tellus at urna. Vivamus at augue eget arcu. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Convallis convallis tellus id
                  interdum velit laoreet id. Cursus euismod quis viverra nibh cras pulvinar mattis nunc sed. Diam quam nulla porttitor massa id. Ac tortor vitae purus faucibus ornare suspendisse 
                  sed nisi. Tristique magna sit amet purus gravida quis blandit turpis cursus.`,
        footer: "12/2/2022"
    },
    {
        username: "Example 7",
        message: `Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Neque volutpat ac tincidunt vitae semper quis. Risus in hendrerit gravida rutrum quisque non 
                  tellus orci. Pretium quam vulputate dignissim suspendisse in est. Vulputate mi sit amet mauris commodo. Quis hendrerit dolor magna eget est. Fames ac turpis egestas 
                  maecenas pharetra convallis posuere morbi leo. Et malesuada fames ac turpis egestas integer. In pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.`,
        footer: "28/1/2022"
    },
    {
        username: "Example 8",
        message: ` Ac tortor vitae purus faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies mi. Urna duis convallis convallis tellus. Mattis ullamcorper velit sed 
                  ullamcorper morbi tincidunt. Sit amet justo donec enim diam. Augue mauris augue neque gravida in. Neque gravida in fermentum et. Sit amet venenatis urna cursus eget 
                  nunc scelerisque viverra mauris.`,
        footer: "10/11/2022"
    },
]

export {reviews}