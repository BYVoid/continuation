(function (cont) {
    try {
        var a = 1;
        var err = 'some-error';
        setTimeout(function () {
            try {
                JSON.parse('invalid-json');
                if (err) {
                    throw err;
                } else {
                }
                a = 2;
                cont();
            } catch (err) {
                cont(err);
            }
        }, 200);
    } catch (err) {
        cont(err);
    }
}(function (err) {
    if (err !== undefined) {
        console.log(err);
    }
    console.log('Done');
}));