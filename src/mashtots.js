/*
 *  Armenian Orthography Converter 2.0.6
 */

(function (global) {
    'use strict';

    var vowel, sonant, alphabet, alphabetWithoutH, alphabetWithoutAOJ,
        end, start, data,
        errorCorrectionSovietToMashtots, errorCorrectionSovietToMashtotsInTheWord,
        errorCorrectionMashtotsToSovietInTheWord, errorCorrectionMashtotsToSoviet,
        wordsParts;

    vowel = 'ԱԵԷԸԻՈՕաեիէըոօ';
    sonant = 'ԲԳԴԶԹԺԼԽԾԿՀՁՂՃՄՅՆՇՉՊՋՌՍՎՏՐՑՓՔՖբգդզթժլխծկհձղճմյնշչպջռսվտրցւփքֆ';
    alphabet = 'ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔևՕՖաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆ';
    alphabetWithoutH = 'ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔևՕՖաբգդեզէըթժիլխծկձղճմյնշոչպջռսվտրցւփքօֆ';
    alphabetWithoutAOJ = 'ԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՆՇՉՊՋՌՍՎՏՐՑՒՓՔևՕՖբգդեզէըթժիլխծկհձղճմնշչպջռսվտրցւփքօֆ';
    end = '[^' + alphabet + '՞՜]|$';
    start = '[^' + alphabet + ']|^';
    data = [
        // Բառմիջում և բառավերջում ա, ե, ի ձայնավորներից հետո վ լսվելիս գրվում է ւ  // սա իրա մեջ ներառում է //  բառավերջում կամ ձայնավորից առաջ    իվ -> իւ
        [
            '([աեիԱԵԻ])վ',
            '$1ւ',
            '([աեիԱԵԻ])ւ',
            '$1վ'
        ],
        //  և - եւ
        [
            'և',
            'եւ',
            'եւ',
            'և'
        ],
        // բաղաձայնից առաջ    յու -> իւ
        [
            '([^' + vowel + ']|' + start + ')յու([' + sonant + '])',
            '$1իւ$2',
            '([^' + vowel + ']|' + start + ')իւ([' + sonant + '])',
            '$1յու$2'
        ],
        // TODO: ո -ից հետո վ -> ւ չի դառնում
        //
        // բարդ բառերում եթե երկրորդ բառը սկսվում է վ տառով, ապա վ մնում է,
        // օր․ ՝  պատմավէպ, կարեվէր, անվերջ
        // այս կետը բաց է մնում
        //
        //  ա, ե, է, ի, ո  ձայնավորներից առաջ, բաղաձայնից և յ կիսաձայնից հետո  վ -> ու
        [
            '([' + sonant + 'յ])վ([աեէիո])',
            '$1ու$2',
            '([' + sonant + 'յ])ու([աեէիո])',
            '$1վ$2'
        ],
        // բառավերջի ե -> է
        [
            '([' + alphabet + '])ե(' + end + ')',
            '$1է$2',
            '([' + alphabet + '])է(' + end + ')',
            '$1ե$2'
        ],
        // ույ -> ոյ    բոլոր իմ տեսած օրինակներում ույ-գտնվում է բաղաձայների մեջ, ինչպես նաև խուսափում ենք այնպիսի ոյան ազգանունների փոփոխելուց
        [
            '([' + sonant + '])ույ([' + sonant + '])',
            '$1ոյ$2',
            '([' + sonant + '])ոյ([' + sonant + '])',
            '$1ույ$2'
        ],
        // յա -> եա  /բայց ոչ բառասկզբում և ոչ ա, ո-ից հետո + յ տառից հետո
        [
            '([' + alphabetWithoutAOJ + '])յա',
            '$1եա',
            '([' + alphabetWithoutAOJ + '])եա',
            '$1յա'
        ],
        // յո -> եօ
        [
            'յո([^ւ])',
            'եօ$1',
            'եօ',
            'յո'
        ],
        // յո -> եօ
        [
            'Յո([^ւ])',
            'Եօ$1',
            'Եօ',
            'Յո'
        ],
        // բառասկզբում յ գրելու համար օրենք չկա պետք է հիշել այդ բառերը
        [
            'հ(ագե|ախճապակ|ախուռն|ածանա|ակինթ|աղթ|աճախ|ամառ|ամր|այտ|անդիման|անդուգն|անկարծ|անկերգ|անձ|անցագործ|անցանք|ապաղ|ապավ|ապաւ|աջող|աջորդ|առ|ասմիկ|ասպիս|ավերժ|ատակ|ատկ|ատուկ|արաբ|արազ|արգ|արդա|արձ|արմ|արութ|աւակ|աւել|աւելեալ|աւետ|աւէտ|աւիտ|ափշտակ|եղա|են|եսան|ետա|երյուրանք|իմար|իշ|իսն|իսուն|իրավի|ղ|ոբել|ոգն|ոդ|ոժար|ոխորտալ|ողդողդ|ոյզ|ոյժ|ոյս|ոնք|ոշոտ|ոպոպ|ոռի|ովազ|ովատակ|ովսե|որանջ|որդ|որդոր|որին|որձ|որջորջել|ուզ|ուլիս|ուղարկ|ույն|ույս|ունապ|ունիս|ունուար|ուշ|ուռթի|ուռութ|ուսա|ստակագեն)',
            'յ$1',
            'յ(ագե|ախճապակ|ախուռն|ածանա|ակինթ|աղթ|աճախ|ամառ|ամր|այտ|անդիման|անդուգն|անկարծ|անկերգ|անձ|անցագործ|անցանք|ապաղ|ապավ|ապաւ|աջող|աջորդ|առ|ասմիկ|ասպիս|ավերժ|ատակ|ատկ|ատուկ|արաբ|արազ|արգ|արդա|արձ|արմ|արութ|աւակ|աւել|աւելեալ|աւետ|աւէտ|աւիտ|ափշտակ|եղա|են|եսան|ետա|երյուրանք|իմար|իշ|իսն|իսուն|իրավի|ղ|ոբել|ոգն|ոդ|ոժար|ոխորտալ|ողդողդ|ոյզ|ոյժ|ոյս|ոնք|ոշոտ|ոպոպ|ոռի|ովազ|ովատակ|ովսե|որանջ|որդ|որդոր|որին|որձ|որջորջել|ուզ|ուլիս|ուղարկ|ույն|ույս|ունապ|ունիս|ունուար|ուշ|ուռթի|ուռութ|ուսա|ստակագեն)',
            'հ$1'
        ],
        // բառասկզբում յ գրելու համար օրենք չկա պետք է հիշել այդ բառերը
        [
            'Հ(ագե|ախճապակ|ախուռն|ածանա|ակինթ|աղթ|աճախ|ամառ|ամր|այտ|անդիման|անդուգն|անկարծ|անկերգ|անձ|անցագործ|անցանք|ապաղ|ապավ|ապաւ|աջող|աջորդ|առ|ասմիկ|ասպիս|ավերժ|ատակ|ատկ|ատուկ|արաբ|արազ|արգ|արդա|արձ|արմ|արութ|աւակ|աւել|աւելեալ|աւետ|աւէտ|աւիտ|ափշտակ|եղա|են|եսան|ետա|երյուրանք|իմար|իշ|իսն|իսուն|իրավի|ղ|ոբել|ոգն|ոդ|ոժար|ոխորտալ|ողդողդ|ոյզ|ոյժ|ոյս|ոնք|ոշոտ|ոպոպ|ոռի|ովազ|ովատակ|ովսե|որանջ|որդ|որդոր|որին|որձ|որջորջել|ուզ|ուլիս|ուղարկ|ույն|ույս|ունապ|ունիս|ունուար|ուշ|ուռթի|ուռութ|ուսա|ստակագեն)',
            'Յ$1',
            'Յ(ագե|ախճապակ|ախուռն|ածանա|ակինթ|աղթ|աճախ|ամառ|ամր|այտ|անդիման|անդուգն|անկարծ|անկերգ|անձ|անցագործ|անցանք|ապաղ|ապավ|ապաւ|աջող|աջորդ|առ|ասմիկ|ասպիս|ավերժ|ատակ|ատկ|ատուկ|արաբ|արազ|արգ|արդա|արձ|արմ|արութ|աւակ|աւել|աւելեալ|աւետ|աւէտ|աւիտ|ափշտակ|եղա|են|եսան|ետա|երյուրանք|իմար|իշ|իսն|իսուն|իրավի|ղ|ոբել|ոգն|ոդ|ոժար|ոխորտալ|ողդողդ|ոյզ|ոյժ|ոյս|ոնք|ոշոտ|ոպոպ|ոռի|ովազ|ովատակ|ովսե|որանջ|որդ|որդոր|որին|որձ|որջորջել|ուզ|ուլիս|ուղարկ|ույն|ույս|ունապ|ունիս|ունուար|ուշ|ուռթի|ուռութ|ուսա|ստակագեն)',
            'Հ$1'
        ],
        // բառավերջում ա -ից հետո դրվում է չկարդացվող յ, բացառություն են կազմում սա դա նա սրա դրա նրա, alphabetWithoutH-ով բացառում ենք հայ-ի դեպքը
        [
            '([' + alphabet + '][' + alphabetWithoutH + '])ա(' + end + ')',
            '$1այ$2',
            '([' + alphabet + '][' + alphabetWithoutH + '])այ(' + end + ')',
            '$1ա$2'
        ],
        // բառավերջում ո -ից հետո դրվում է չկարդացվող յ  // սա առանձնացվել է հատուկ հայ բառի պատճառով
        [
            '([' + alphabet + '])ո(' + end + ')',
            '$1ոյ$2',
            '([' + alphabet + '])ոյ(' + end + ')',
            '$1ո$2'
        ],
        // բառավերջի  են ->  Էն
        [
            '([' + alphabet + '])են(' + end + ')',
            '$1էն$2',
            '([' + alphabet + '])էն(' + end + ')',
            '$1են$2'
        ],
        // բառավերջի  եի ->  Էի
        [
            '([' + alphabet + '])եի(' + end + ')',
            '$1էի$2',
            '([' + alphabet + '])էի(' + end + ')',
            '$1եի$2'
        ]
        /*
         //բառավերջի  ոն ->  օն
         [
         '([' + alphabet + '])ոն($)',
         '$1օն$2',
         '([' + alphabet + '])օն($)',
         '$1ոն$2'
         ]
         */
    ];
    // սխալների ուղղում կամ բացառություններ
    errorCorrectionSovietToMashtots = [
        ['սրայ', 'սրա'], ['Սրայ', 'Սրա'], ['դրայ', 'դրա'], ['Դրայ', 'Դրա'],
        ['նրայ', 'նրա'], ['Նրայ', 'Նրա'], ['հիմայ', 'հիմա'], ['Հիմայ', 'Հիմա'],
        ['ապայ', 'ապա'], ['Ապայ', 'Ապա'], ['նրայ', 'նրա'], ['Նրայ', 'Նրա'],
        ['ահայ', 'ահա'], ['Ահայ', 'Ահա'], ['այոյ', 'այո'], ['Այոյ', 'Այո'],
        ['աղայ', 'աղա'], ['Աղայ', 'Աղա'], ['փաշայ', 'փաշա'], ['Փաշայ', 'Փաշա'],
        ['ամիրայ', 'ամիրա'], ['Ամիրայ', 'Ամիրա'], ['կակաոյ', 'կակաո'], ['Կակաոյ', 'Կակաո'],
        ['այոյ', 'այո'], ['Այոյ', 'Այո'],
        ['Փօքր', 'Փոքր'], ['կօնք', 'կոնք'], ['Կօնք', 'Կոնք'],
        ['Վու', 'Ւու'], ['ուու', 'ւու'], ['Ուու', 'Ւու'],
        ['էւ', 'եւ'], ['Էւ', 'Եւ'], ['քոյ', 'քո'], ['Քոյ', 'Քո'],
        ['կա', 'կայ'], ['Կա', 'Կայ'], ['գա', 'գայ'], ['Գա', 'Գայ'],
        ['գեր', 'գէր'], ['Գեր', 'Գէր'], ['մնայ', 'մնա'],
        ['այեղագոռ', 'ահեղագոռ'], ['գէտնաթաղ', 'գետնաթաղ'], ['փետ', 'փէտ'],
        ['քանակապէս', 'քանակապես'], ['օք', 'ոք'], ['որբեվայրի', 'որբեւայրի'],
        ['մեկն', 'մէկն'], ['մեհէնապետ', 'մեհենապետ'], ['մատենաւար', 'մատենավար'],
        ['մասէրով', 'մասերով']
    ];
    errorCorrectionSovietToMashtotsInTheWord = [
        ['ակադէմ', 'ակադեմ'],
        ['փօքր', 'փոքր'], ['վու', 'ւու'], ['աւէտ', 'աւետ'],
        ['յաւետ', 'յաւէտ'], ['գմբեթ', 'գմբէթ'], ['մեկ', 'մէկ'],
        ['թեպետ', 'թէպէտ'], ['Աբել', 'Աբէլ'],
        ['ուու', 'ւու'], ['սէրնդ', 'սերնդ'], ['սէրունդ', 'սերունդ'], ['ղեկաւար', 'ղեկավար'],
        ['Աւէտիք', 'Աւետիք'], ['Հակոբ', 'Յակոբ'], ['ազգէր', 'ազգեր'], ['ակտիւորէն', 'ակտիւօրէն'],
        ['ամենաւ', 'ամենավ'], ['ամենուր', 'ամէնուր'], ['սէրել', 'սերել'], ['սէրվ', 'սերվ'],
        ['անուերջ', 'անվերջ'], ['ւարձ', 'վարձ'], ['տոմսէր', 'տոմսեր'], ['եութիւն', 'էութիւն'],
        ['եղբոր', 'եղբօր'], ['երեկ', 'երէկ'], ['կէնդ', 'կենդ'],
        ['աեօվ', 'այով'], ['իդեալ', 'իդէալ'], ['կէնս', 'կենս'],
        ['իրէն', 'իրեն'], ['կէնտ', 'կենտ'], ['ոյան', 'ոյեան'], ['կէնս', 'կենս'], ['իրէն', 'իրեն'],
        ['խօստ', 'խոստ'], ['ծափայար', 'ծափահար'],
        ['յարաւ', 'հարաւ'], ['յարբ', 'հարբ'], ['յարիր', 'հարիր'], ['յարիւր', 'հարիւր'],
        ['յարց', 'հարց'], ['յենց', 'հենց'], ['յոդուած', 'յօդուած'],
        ['հօրդոր', 'յորդոր'], ['([^ո])ւառ', '$1վառ'], ['հրեշ', 'հրէշ'],
        ['մայար', 'մահար'], ['ւայր', 'վայր'], ['որօնք', 'որոնք'], ['(' + start + ')ցող', '$1ցօղ'],
        ['պատայար', 'պատահար'], ['պոեմ', 'պօէմ'], ['հետո', 'յետո'],
        ['երէկո', 'երեկո'], ['հոլովակ', 'յոլովակ'],
        ['սկավառ', 'սկաւառ'], ['մէկն', 'մեկն'], ['մեքէնա', 'մեքենա'], ['տերև', 'տերեւ'],
        ['րոպե', 'րոպէ'], ['հրեա', 'հրէա'],
        ['շատէր', 'շատեր'], ['պատէր', 'պատեր'], ['կնուիրուէն', 'կնուիրուեն'],
        ['([' + alphabet + '])յարութ', '$1հարութ'],
        ['ւստահ', 'վստահ'], ['ուախճան', 'վախճան'], ['ատօք', 'ատոք'],
        ['գավառ', 'գաւառ'], ['ւճար', 'վճար'], ['ւաճառ', 'վաճառ'],
        ['([^ո])ւար(ութիւն|ման)', '$1վար$2'], ['դէմիրճեան', 'դեմիրճեան'], ['եդէմ', 'եդեմ'],
        ['ժողւուրդ', 'ժողովուրդ'], ['ինտէ', 'ինտե'], ['ւիճակ', 'վիճակ'], ['լամլամօրել', 'լամլամորել'],
        ['խռւ', 'խռով'], ['ւիժ', 'վիժ'], ['դրօշմ', 'դրոշմ'], ['կառլէն', 'կառլեն'], ['մօրթ', 'մորթ'],
        ['կդադար', 'կը-դադար'], ['կինո([^ւ])', 'կինօ$1'], ['ուզէնք', 'ուզենք'],
        ['համւ', 'համով'], ['հաշւէ', 'հաշուե'], ['յարմոն', 'հարմոն'],
        ['(' + start + ')հարատ', '$1յարատ'], ['(' + start + ')հօնք', '$1յօնք'],
        ['հէգն', 'հեգն'], ['հոգսէր', 'հոգսեր'], ['հւուեր', 'հովուեր'],
        ['հրէշտակ', 'հրեշտակ'], ['զգէստ', 'զգեստ'], ['մէտաքս', 'մետաքս'],
        ['ւարս', 'վարս'], ['մտէրմ', 'մտերմ'], ['յետամուտ', 'հետամուտ'], ['նուիրատւութ', 'նուիրատուութ'],
        ['շմօր', 'շմոր'], ['շոգէ', 'շոգե'], ['շոեօղ', 'շոյող'], ['ոգէշնչ', 'ոգեշնչ'],
        ['րօրակ', 'րորակ'], ['պատուեր', 'պատուէր'], ['սավառն', 'սաւառն'],
        ['ւարժակ', 'վարժակ'], ['սէրմ', 'սերմ'], ['([^խ])որէն', '$1օրէն'], ['սէրտ', 'սերտ'],
        ['սոսնձու(մ|կ)', 'սօսնձու$1'], ['մօտոր', 'մոտոր'], ['օրթոդօքս', 'օրթոդոքս'], ['չարէնց', 'չարենց'],
        ['չէզօք', 'չէզոք'], ['ունէն', 'ունեն'], ['չօք', 'չոք'], ['համառոտ', 'համառօտ'], ['ւիպ', 'վիպ'],
        ['պարգեւատւ', 'պարգեւատու'], ['պարկէտ', 'պարկետ'], ['ուարչութ', 'վարչութ'], ['պէտքաղ', 'պետքաղ'],
        ['պլեբեեա', 'պլեբէյա'], ['պլեբեյ', 'պլեբէյ'], ['իւեր', 'իվեր'], ['դիվեր', 'դիւեր'], ['ունիվերս', 'ունդիւերս'],
        ['ուէժ', 'վէժ'], ['ցողել', 'ցօղել'], ['ռեակտ', 'ռէակտ'], ['էրէն', 'երէն'], ['սաժէն', 'սաժեն'],
        ['սէրակեր', 'սերակեր'], ['սէրգեյ', 'սերգեյ'], ['սէրժ', 'սերժ'], ['սէրհատ', 'սերհատ'],
        ['սէրում', 'սերում'], ['սթիւէն', 'սթիւեն'], ['ահօտ', 'ահոտ'], ['սկէս', 'սկես'], ['սուէտ', 'սովետ'],
        ['սովօրէ', 'սովորե'], ['ուսէր', 'ուսեր'], ['ստամօքս', 'ստամոքս'], ['ւայել', 'վայել'], ['օրդ', 'որդ'],
        ['վաշինգտօն', 'վաշինգտոն'], ['ւազք', 'վազք'], ['էնի', 'ենի'], ['վեյանձ', 'վեհանձ'],
        ['վերասէր', 'վերասեր'], ['վյատակ', 'վհատակ'], ['ւուշա', 'վուշա'], ['վրդւ', 'վրդով'],
        ['էրորդ', 'երորդ'], ['ւախութիւն', 'վախութիւն'], ['ւ([եէ])րջ', 'վ$1րջ'], ['տարօրոշ', 'տարորոշ'],
        ['տեղեկատւու', 'տեղեկատուու'], ['տէրեւ', 'տերեւ'], ['աւարդ', 'ավարդ'], ['տէրիտորիա', 'տերիտորիա'],
        ['տեւտօն', 'տեւտոն'], ['սուար', 'սվար'], ['լեօզ', 'լյոզ'], ['տրիտօն', 'տրիտոն'], ['յառաչ', 'հառաչ'],
        ['ցրտաւար', 'ցրտավար'], ['ուանկ', 'վանկ'], ['(հաշ|ուր)վանկ', '$1ուանկ'], ['փետ(անալ|ացնել)', 'փէտ$1'],
        ['աւարական', 'ավարական'], ['ուարական', 'վարական'], ['րւութիւն', 'րովութիւն'], ['քուեա', 'քուէա'],
        ['(' + start + '|հանրա)քուեն', '$1քուէն'], ['քրեա', 'քրէա'], ['քրիստօ', 'քրիստո'],
        ['ֆեստօն', 'ֆէստոն'], ['ֆեստիւալ', 'ֆէստիվալ'], ['մէտր', 'մետր'], ['բորբօք', 'բորբոք'],
        ['(' + start + ')որդէ', '$1որդե'], ['ոսկեցող', 'ոսկեցօղ'], ['ոսկէ([' + alphabet + '])', 'ոսկե$1'],
        ['ուէմ', 'ուեմ'], ['ողօք', 'ողոք'], ['ոլօք', 'ոլոք'], ['ոգէթափանց', 'ոգեթափանց'],
        ['շերտէր', 'շերտեր'], ['շաքարօտ', 'շաքարոտ'], ['ուաստակ', 'վաստակ'], ['նվաստական', 'նուաստական'],
        ['պատվաստակ', 'պատուաստակ'], ['շայատ', 'շահատ'], ['էնուէր', 'էնուեր'], ['ցնէն', 'ցնեն'],
        ['յետախուզ', 'հետախուզ'], ['յետազօտ', 'հետազօտ'], ['նայատակ', 'նահատակ'], ['հիմնահատակ', 'հիմնահատակ'],
        ['հունաստան', 'յունաստան'], ['(' + start + ')յագո', '$1եագո'], ['մորմօք', 'մորմոք'],
        ['(' + start + ')մոր(' + end + '|ա|եղբ|ով|ը|ուք)', '$1մօր$2'], ['մօտո', 'մոտո'],
        ['մոլիբդէն', 'մոլիբդեն'], ['տւութե', 'տուութե'], ['րօնք', 'րոնք'], ['մեքենաւար', 'մեքենավար'],
        ['մէտաղ', 'մետաղ'], ['մէկուս', 'մեկուս'], ['կէնցաղ', 'կենցաղ'], ['մարգագէտ', 'մարգագետ'],
        ['ւեներա', 'վեներա'], ['(' + start + ')մանուել', '$1մանուէլ'], ['մանկաւարժ', 'մանկավարժ'],
        ['մաեօր', 'մայոր'], ['մակոյկաւար', 'մակոյկավար'], ['հաշուառուել', 'հաշվառուել'],
        ['(' + start + ')կ(լին|հաղորդ|մնա|վնաս)', '$1կը-$2'],
        ['(' + start + ')կ(ուզեն|ունե)', '$1կ\'$2']
    ];
    errorCorrectionMashtotsToSovietInTheWord = [
        ['([^ոե])ւ', '$1վ'],
        ['փօքր', 'փոքր'], ['ւու', 'վու'],
        ['հրավէր', 'հրավեր'], ['հրէշ', 'հրեշ'],
        ['յաւէտ', 'հավետ'], ['գմբէթ', 'գմբեթ'], ['մէկ', 'մեկ'], ['յոլովակ', 'հոլովակ'],
        ['թէպէտ', 'թեպետ'], ['Աբէլ', 'Աբել'],
        ['մանրէ', 'մանրե'], ['սէրնդ', 'սերնդ'],
        ['սէրունդ', 'սերունդ'], ['ղեկաւար', 'ղեկավար'], ['Յակոբ', 'Հակոբ'],
        ['ակտիւօրէն', 'ակտիւորէն'], ['ամենաւ', 'ամենավ'], ['ամէնուր', 'ամենուր'],
        ['սէրել', 'սերել'], ['սէրվ', 'սերվ'], ['անուերջ', 'անվերջ'],
        ['տոմսէր', 'տոմսեր'], ['բարոր', 'բարօր'],
        ['եղբօր', 'եղբոր'], ['երէկ', 'երեկ'],
        ['այով', 'աեօվ'], ['իդէալ', 'իդեալ'], ['յետո', 'հետո'],
        ['ոյեան', 'ոյան'], ['հաշիւ', 'հաշիվ'], ['յօդուած', 'յոդուած'], ['յորդոր', 'հորդոր'],
        ['ցօղ', 'ցող'], ['հրաւէր', 'հրավեր'],
        ['սկաւառ', 'սկավառ'], ['պօէմ', 'պոեմ'], ['րոպէ', 'րոպե'],
        ['(' + start + ')ևա(ան|յի|ին|ից|ով)(' + end + ')', 'եվա$2'],
        ['կը-', 'կ'], ['կինօ', 'կինո'], ['կոլեկտյու', 'կոլեկտիվ'],
        ['կ\'', 'կ'], ['նահենք', 'նայենք'], ['պատվէր', 'պատվեր'],
        ['տօրեն', 'տորեն'], ['([^ատ]|[' + alphabet + '][ա])նօրեն', '$1նորեն'],
        ['սօսնձ', 'սոսնձ'], ['տարիե', 'տարիէ'], ['պահուսակ', 'պայուսակ'],
        ['(' + start + ')յարատ', '$1հարատ'], ['առօտ', 'առոտ'], ['պարզապես', 'պարզապէս'],
        ['վենեսվելա', 'վենեսուելա'], ['վէստ', 'վեստ'], ['փէտ(անալ|ացնել)', 'փետ$1'],
        ['պլեբէյ', 'պլեբեյ'], ['աղվէս', 'աղվես'], ['ռէակտ', 'ռեակտ'], ['իօրեն', 'իորեն'],
        ['որինակ', 'օրինակ'], ['(' + start + ')րոպյա', '$1րոպեա'], ['քվէա', 'քվեա'],
        ['մանրե([^լ])', 'մանրէ$1'], ['ոքսիդ', 'օքսիդ'], ['օրեն(' + end + ')', 'որեն$1'],
        ['քվէն', 'քվեն'], ['քրէա', 'քրեա'], ['ֆէստ(ոն|իվալ)', 'ֆեստ$1'], ['յունաստան', 'հունաստան'],
        ['հառաջ', 'յառաջ'], ['(' + start + ')եագո', '$1յագո'], ['(' + start + ')մօր', '$1մոր'],
        ['մանվէլ', 'մանվել']
    ];
    errorCorrectionMashtotsToSoviet = [
        ['խո', 'խոյ'], ['Խո', 'Խոյ'], ['Նո', 'Նոյ'], ['կայ', 'կա'],
        ['Կայ', 'Կա'], ['մանրե', 'մանրէ'], ['գէր', 'գեր'],
        ['Գէր', 'Գեր'], ['չե', 'չէ'], ['Չե', 'Չէ'], ['տարորինակ', 'տարօրինակ'],
        ['անոթևան', 'անօթևան'], ['հրյա', 'հրեա'], ['չեի', 'չէի'], ['տերը', 'տէրը'],
        ['փէտ', 'փետ'], ['շվուոց', 'շվվոց']
    ];
    //ածանցներ և արմատներ, որոնք պետք է ուղղակի հիշվեն
    wordsParts = [
        ['ավոր', 'աւոր'], ['վետ', 'ւէտ'], ['ավուն', 'աւուն'], ['զեն', 'զէն'],
        ['դեմ', 'դէմ'], ['դեպ', 'դէպ'], ['տեր', 'տէր'],
        ['աղետ', 'աղէտ'], ['արժեք', 'արժէք'], ['արեն', 'արէն'],
        ['գետ', 'գէտ'], ['դեպ', 'դէպ'], ['դետ', 'դէտ'],
        ['եղեն', 'եղէն'], ['երեն', 'երէն'], ['երեց', 'երէց'],
        ['կեն', 'կէն'], ['կետ', 'կէտ'], ['մետ', 'մէտ'], ['մեջ', 'մէջ'],
        ['շեն', 'շէն'], ['պես', 'պէս'], ['սեր', 'սէր'], ['վեժ', 'վէժ'],
        ['վեպ', 'վէպ'], ['վերք', 'վէրք'], ['վրեպ', 'վրէպ'], ['քեն', 'քէն'],
        ['օրեն', 'օրէն'], ['աղեկեզ', 'աղեկէզ'], ['աղետ', 'աղէտ'],
        ['աղվես', 'աղուէս'], ['անզեն', 'անզէն'],
        ['անեծք', 'անէծք'], ['անշեջ', 'անշէջ'], ['աշղետ', 'աշղէտ'], ['ապավեն', 'ապաւէն'],
        ['գեթ', 'գէթ'], ['գեշ', 'գէշ'], ['գես', 'գէս'],
        ['գմբեթ', 'գմբէթ'], ['գոմեշ', 'գոմէշ'], ['դեզ', 'դէզ'], ['դեմ', 'դէմ'],
        ['ապաքեն', 'ապաքէն'], ['առնետ', 'առնէտ'], ['ասպարեզ', 'ասպարէզ'],
        ['արալեք', 'արալէք'], ['արժեք', 'արժէք'], ['բզեզ', 'բզէզ'], ['բվեճ', 'բուէճ'],
        ['բրետ', 'բրէտ'], ['զենք', 'զէնք'], ['զենիթ', 'զէնիթ'], ['ընդդեմ', 'ընդդէմ'],
        ['ընկեց', 'ընկէց'], ['թեև', 'թէև'], ['թեժ', 'թէժ'], ['թեպետ', 'թէպէտ'],
        ['ժամկետ', 'ժամկէտ'], ['ժապավեն', 'ժապաւէն'], ['լեգեոն', 'լեգէոն'],
        ['խաբեություն', 'խաբէութիւն'], ['խեթ', 'խէթ'], ['խեժ', 'խէժ'], ['խլեզ', 'խլէզ'],
        ['ծես', 'ծէս'], ['ծովահեն', 'ծովահէն'], ['ծվեն', 'ծուէն'], ['կեզ', 'կէզ'],
        ['կես', 'կէս'], ['կողպեք', 'կողպէք'], ['կուզեկուզ', 'կուզէկուզ'], ['դեմք', 'դէմք'],
        ['դեն', 'դէն'], ['դեպի', 'դէպի'], ['դեպք', 'դէպք'], ['ելակետ', 'ելակէտ'],
        ['ելևեջ', 'ելևէջ'], ['եզեգ', 'եզէգ'], ['մեգ', 'մէգ'], ['մեզ', 'մէզ'], ['մեկ', 'մէկ'],
        ['մեջ', 'մէջ'], ['մետ', 'մէտ'], ['մողես', 'մողէս'],
        ['հավետ', 'յաւէտ'], ['հետադեմ', 'յետադէմ'], ['նշանդրեք', 'նշանդրէք'], ['նվեր', 'նուէր'],
        ['շահեն', 'շահէն'], ['շեկ', 'շէկ'], ['շեն', 'շէն'], ['ողջակեզ', 'ողջակէզ'],
        ['ուղեշ', 'ուղէշ'], ['չեզոք', 'չէզոք'], ['պանթեոն', 'պանթէոն'], ['պարեն', 'պարէն'],
        ['պարետ', 'պարէտ'], ['պարտեզ', 'պարտէզ'], ['պետք', 'պէտք'], ['պնակալեզ', 'պնակալէզ'],
        ['կրետ', 'կրէտ'], ['հանպեդ', 'հանդէպ'], ['հանդես', 'հանդէս'],
        ['հեգ', 'հէգ'], ['հելլեն', 'հելլէն'], ['հեն', 'հէն'], ['հյուսկեն', 'հիւսկէն'],
        ['հրավեր', 'հրաւէր'], ['հրեշ', 'հրէշ'], ['հրշեջ', 'հրշէջ'],
        ['ձեթ', 'ձէթ'], ['տեգ', 'տէգ'], ['տերունական', 'տէրունական'], ['տերտեր', 'տէրտէր'],
        ['տնօրեն', 'տնորէն'], ['փոխարեն', 'փոխարէն'], ['ջրվեժ', 'ջրվէժ'], ['ջրօրհնեք', 'ջրօրհնէք'],
        ['սեգ', 'սէգ'], ['սեզ', 'սէզ'], ['սպառազեն', 'սպառազէն'], ['վեճ', 'վէճ'], ['վեմ', 'վէմ'],
        ['վեպ', 'վէպ'], ['վէս', 'վես'], ['վերք', 'վէրք'], ['վրեժ', 'վրէժ'], ['տարեց', 'տարէց'],
        ['փրփադեզ', 'փրփրադէզ'], ['քարտեզ', 'քարտէզ'], ['քեն', 'քէն'],
        ['քնեած', 'քնէած'], ['քրեական', 'քրէական'],
        //բառամիջում օ հանդիպող հիմնական բառերը
        ['աղոթք', 'աղօթք'], ['աղոտ', 'աղօտ'], ['անոթ', 'անօթ'],
        ['առավոտ', 'առաւօտ'], ['արոտ', 'արօտ'], ['արոր', 'արօր'],
        ['դրոշ', 'դրօշ'], ['զբոսն', 'զբօսն'], ['զգոն', 'զգօն'],
        ['զոդ', 'զօդ'], ['զոր', 'զօր'], ['թափոր', 'թափօր'], ['թոշն', 'թօշն'], ['խոս', 'խօս'],
        ['կրոն', 'կրօն'], ['հոտ', 'հօտ'], ['ճոճ', 'ճօճ'], ['մոտ', 'մօտ'], ['տոն', 'տօն'],
        ['օրոր', 'օրօր'], ['ոք', 'օք'], ['ոնք', 'օնք'], ['եոք', 'եօք'],
        ['անեծք', 'անէծք'], ['լեգեոն', 'լեգէոն'], ['կուզեկուզ', 'կուզէկուզ'],
        ['պանթեոն', 'պանթէոն'], ['ախպեր', 'ախպէր'], ['քրեական', 'քրէական'],
        ['չեզոք', 'չէզոք'], ['պետք', 'պէտք'], ['հրեա', 'հրէայ'],
        ['պարետ', 'պարէտ'], ['քարտեզ', 'քարտէզ'], ['շեջ', 'շէջ'], ['պարտեզ', 'պարտէզ'],
        ['ընկեց', 'ընկէց'], ['ժետ', 'ժէտ'], ['կեզ', 'կէզ'],
        ['հանդես', 'հանդէս'], ['հրավեր', 'հրավէր'], ['եիր', 'էիր'], ['եիք', 'էիք'],
        ['եոս', 'էոս'], ['եաս', 'էաս'],
        ['ակոս', 'ակօս'], ['աղորիք', 'աղօրիք'], ['ամոթ', 'ամօթ'],
        ['ապարոշ', 'ապարօշ'], ['արտոսր', 'արտօսր'],
        ['բռնազբոսիկ', 'բռնազբօսիկ'], ['բոթ', 'բօթ'], ['գոշ', 'գօշ'],
        ['գոս', 'գօս'], ['գոտի', 'գօտի'], ['դոդոշ', 'դօդօշ'],
        ['զոշաքաղ', 'զօշաքաղ'], ['թոթափ', 'թօթափ'], ['թոն', 'թօն'],
        ['թոթվել', 'թօթուել'], ['լոթի', 'լօթի'], ['լոլիկ', 'լօլիկ'], ['խոլ', 'խօլ'],
        ['ծանոթ', 'ծանօթ'], ['ծղոտ', 'ծղօտ'], ['ծնոտ', 'ծնօտ'],
        ['կարոտ', 'կարօտ'], ['կոշիկ', 'կօշիկ'], ['հետազոտ', 'հետազօտ'],
        ['ձոն', 'ձօն'], ['ղողանջ', 'ղօղանջ'], ['յոդ', 'յօդ'], ['հոժար', 'յօժար'],
        ['հոնք', 'յօնք'], ['հոշոտել', 'յօշոտել'], ['հորանջ', 'յօրանջ'],
        ['հորին', 'յօրին'], ['նարոտ', 'նարօտ'], ['պռոշ', 'պռօշ'],
        ['սոլ', 'սօլ'], ['սոսի', 'սօսի'], ['սոսափ', 'սօսափ'],
        ['վառոդ', 'վառօդ'], ['տոթ', 'տօթ'], ['քող', 'քօղ'], ['հայաց', 'հայեաց'],
        ['Գայանե', 'Գայեանէ'], ['դայակ', 'դայեակ'], ['աերո', 'աէրո'], ['ավտո', 'աւտօ'],
        ['բեյրութ', 'բէյրութ'], ['գրավվե', 'գրաւուե'], ['գրավվի', 'գրաւուի'],
        ['վեք', 'ուէք'], ['եյան', 'եյեան'], ['փեշ', 'փէշ'], ['նեին', 'նէին'],
        ['հանգե', 'յանգե'], ['հեյ', 'հէյ'], ['մանյովր', 'մանեօւր'], ['մովսես', 'մովսէս'],
        ['շեֆական', 'շէֆական'], ['պեծպծալի', 'պէծպծալի'], ['ռադիո', 'ռադիօ'],
        ['չերքեզի', 'չէրքէզի'], ['պատճե', 'պատճէ'], ['պատնեշ', 'պատնէշ'], ['պարգևվել', 'պարգեւուել'],
        ['պեծ', 'պէծ'], ['պոեզիա', 'պօէզիա'], ['պրոֆես', 'պրոֆէս'], ['ջահել', 'ջահէլ'],
        ['ռաֆայել', 'ռաֆայէլ'], ['սամվել', 'սամուէլ'], ['սվերդ', 'սուերդ'], ['սվեր', 'սուէր'],
        ['տվյալ', 'տուեալ'], ['փոխնեփոխ', 'փոխնէփոխ'], ['վույտ', 'ուոյտ'], ['օվկիան', 'ովկիան'],
        ['օրեցօր', 'օրէցօր'], ['հաբեշ', 'հաբէշ'], ['հածել', 'յածել'], ['հակոբ', 'յակոբ'],
        ['ոստրեբուծական', 'ոստրէբուծական'], ['շվեդ', 'շուէդ'], ['շոշափել', 'շօշափել'],
        ['շոշափել', 'շօշափել'], ['մորուս', 'մօրուս'], ['շեյխ', 'շէյխ'], ['շարվեշար', 'շարուէշար'],
        ['նորվեգ', 'նորուէգ'], ['նոսր', 'նօսր'], ['նոթ', 'նօթ'], ['յանուկովիչ', 'եանուկովիչ'],
        ['յամբ', 'եամբ'], ['միքայել', 'միքայէլ'], ['մերացու', 'մէրացու'], ['մեծավերջ', 'մեծավէրջ']
    ];

    function replace(text, expression, replacement, isShowPath) {
        var temp;
        temp = text;
        text = text.replace(new RegExp(expression, 'g'), replacement);
        if (isShowPath && temp !== text) {
            console.log(temp + '->' + text + ' (' + expression + ')');
        }
        return text;
    }

    function toMashtots(text, isShowPath) {
        var i, length, expression, replacement;

        if (typeof isShowPath !== 'boolean') {
            isShowPath = false;
        }

        // word parts that have no rules
        for (i = 0, length = wordsParts.length; i < length; i++) {
            expression = wordsParts[i][0];
            replacement = wordsParts[i][1];
            text = replace(text, expression, replacement, isShowPath);
        }

        // main spelling
        for (i = 0, length = data.length; i < length; i++) {
            expression = data[i][0];
            replacement = data[i][1];
            text = replace(text, expression, replacement, isShowPath);
        }
        // for mistakes in the word make right
        for (i = 0, length = errorCorrectionSovietToMashtotsInTheWord.length; i < length; i++) {
            expression = errorCorrectionSovietToMashtotsInTheWord[i][0];
            replacement = errorCorrectionSovietToMashtotsInTheWord[i][1];
            text = replace(text, expression, replacement, isShowPath);
        }
        // for mistakes make right
        for (i = 0, length = errorCorrectionSovietToMashtots.length; i < length; i++) {
            expression = '(' + start + ')';
            expression += errorCorrectionSovietToMashtots[i][0];
            expression += '(' + end + ')';
            replacement = '$1' + errorCorrectionSovietToMashtots[i][1] + '$2';
            text = replace(text, expression, replacement, isShowPath);
        }

        return text;
    }

    /*
     Note: the reverse conversion is done in reverse order
     because some rules applied in chain cause unwanted
     side-effect, so order matters, and it needs to be
     reversed in the reverse conversion
     */
    function toSoviet(text, isShowPath) {
        var i, length, expression, replacement;

        if (typeof isShowPath !== 'boolean') {
            isShowPath = false;
        }

        for (i = 0, length = wordsParts.length; i < length; i++) {
            expression = wordsParts[i][1];
            replacement = wordsParts[i][0];
            text = replace(text, expression, replacement, isShowPath);
        }

        for (i = data.length - 1; i >= 0; i--) {
            expression = data[i][2];
            replacement = data[i][3];
            text = replace(text, expression, replacement, isShowPath);
        }
        // for mistakes in the word make right
        for (i = 0, length = errorCorrectionMashtotsToSovietInTheWord.length; i < length; i++) {
            expression = errorCorrectionMashtotsToSovietInTheWord[i][0];
            replacement = errorCorrectionMashtotsToSovietInTheWord[i][1];
            text = replace(text, expression, replacement, isShowPath);
        }

        for (i = 0, length = errorCorrectionMashtotsToSoviet.length; i < length; i++) {
            expression = '(' + start + ')';
            expression += errorCorrectionMashtotsToSoviet[i][0];
            expression += '(' + end + ')';
            replacement = '$1' + errorCorrectionMashtotsToSoviet[i][1] + '$2';
            text = replace(text, expression, replacement, isShowPath);
        }
        return text;
    }

    /*
     * Public methods
     */
    global.toMashtots = toMashtots;
    global.toSoviet = toSoviet;
}(typeof window === 'object' ? window : exports));
