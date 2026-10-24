export type Cue = {id:string; text:string; pause:number; stage:string; count?:number; start?:number; end?:number; voiceEnd?:number};
const cue=(id:string,text:string,pause:number,stage:string,count?:number):Cue=>({id,text,pause,stage,count});
export const welcome: Cue[] = [
 cue('w01','Seja muito bem-vindo. Este é um espaço criado especialmente para você.',3,'Chegar'),
 cue('w02','Aqui, você terá acesso a técnicas de meditação, respiração consciente e relaxamento, que podem contribuir para o seu bem-estar físico e emocional.',3,'Uma pausa'),
 cue('w03','Você já percebeu como nossa mente costuma viajar entre lembranças do passado e preocupações com o futuro?',3,'Perceber'),
 cue('w04','Em alguns momentos, esses pensamentos podem intensificar a ansiedade e nos afastar da experiência do presente.',3,'Perceber'),
 cue('w05','A meditação é uma forma de exercitar a atenção ao que está acontecendo agora.',3,'Estar presente'),
 cue('w06','Ao observar sua respiração, seu corpo e seus pensamentos, você aprende a retornar gentilmente ao aqui e agora.',3,'Retornar'),
 cue('w07','Com a prática, esse exercício pode ajudar a desenvolver a atenção, a concentração e uma relação mais consciente com os próprios pensamentos.',3,'Experimentar'),
 cue('w08','Pesquisas apontam benefícios potenciais de alguns programas de meditação para a ansiedade. Para estresse, a evidência é mais limitada. Os resultados variam e este aplicativo ainda não foi avaliado em estudos.',3,'Com responsabilidade'),
 cue('w09','E o mais importante: você não precisa parar de pensar, alcançar uma sensação especial ou fazer tudo perfeitamente.',3,'Sem cobranças'),
 cue('w10','Basta experimentar. Este é o seu momento. Vamos começar?',3,'No seu tempo')
];
export const meditation: Cue[] = [
 cue('m01','Encontre uma posição confortável. Você pode se sentar com os pés apoiados no chão, sobre uma almofada ou em outro lugar onde se sinta bem.',7,'Acomodar o corpo'),
 cue('m02','Se desejar, feche suavemente os olhos. Se preferir, mantenha-os abertos, repousando o olhar em um ponto tranquilo.',7,'Acomodar o corpo'),
 cue('m03','Se estiver confortável, vamos começar. Você pode pausar ou interromper a qualquer momento. Se sentir desconforto, abra os olhos, observe o ambiente e volte à sua respiração habitual.',6,'Acomodar o corpo'),
 cue('m04','Imagine que você está em um lugar calmo, seguro e agradável. Pode ser um jardim, uma praia tranquila, perto de uma árvore ou qualquer lugar onde você se sinta em paz.',8,'Acomodar o corpo'),
 cue('m05','Perceba seu corpo. Sinta o contato do lugar onde está sentado. Observe a textura, a temperatura e o apoio que sustenta o seu peso.',8,'Perceber os apoios'),
 cue('m06','Permita que seu corpo descanse. Relaxe suavemente os ombros. Solte seus braços. Deixe suas mãos repousarem confortavelmente.',8,'Perceber os apoios'),
 cue('m07','Perceba seu rosto, sua mandíbula e sua testa. Não é necessário fazer esforço. Durante estes próximos minutos, você não precisa resolver nada. Apenas esteja presente.',10,'Apenas estar'),
 cue('m08','Agora, leve sua atenção até sua respiração. Perceba o ar entrando suavemente pelas suas narinas. Acompanhe mentalmente a passagem do ar.',8,'Encontrar a respiração'),
 cue('m09','Imagine seus pulmões se expandindo naturalmente. O oxigênio que chega aos pulmões participa dos processos que sustentam o funcionamento do nosso corpo. Imagine, de maneira suave, essa sensação de renovação.',8,'Encontrar a respiração'),
 cue('m10','Agora, permita que o ar saia naturalmente, pela boca se isso for confortável. Observe a saída do ar. Sem pressa. Não é preciso respirar mais fundo nem prender o ar.',10,'Encontrar a respiração'),
 cue('m11','Vou guiar uma contagem de um a dez. Cada número acompanha uma respiração completa, no seu ritmo. Os números são convites, não um metrônomo. Se precisar de mais tempo, pause a gravação e retome quando desejar.',5,'Contar com gentileza'),
 cue('m12','Inspire suavemente. Perceba o ar entrando. Observe seu corpo recebendo essa respiração. Agora solte o ar de maneira confortável. Ao terminar de expirar, conte mentalmente: um.',12,'Primeira respiração',1),
 cue('m13','Novamente, inspire com suavidade. Perceba a passagem do ar pelas narinas. Imagine seus pulmões se expandindo. Deixe que o ar saia. Quando terminar de expirar, conte mentalmente: dois.',12,'Segunda respiração',2),
 cue('m14','Continue acompanhando sua respiração. Observe a inspiração. Sinta a expansão natural do corpo. Solte o ar. Conte mentalmente: três.',12,'Terceira respiração',3),
 cue('m15','Talvez sua mente comece a pensar em outras coisas. Você poderá lembrar de ontem ou pensar no que precisa fazer amanhã. Isso é natural. A mente produz pensamentos.',8,'Perceber e retornar'),
 cue('m16','Quando perceber que sua atenção se afastou, não se critique. Reconheça o pensamento e retorne gentilmente ao ar entrando e saindo. Não é necessário expulsar os pensamentos. Cada retorno é uma oportunidade de praticar.',8,'Perceber e retornar'),
 cue('m17','Voltamos à contagem. Perceba o ar entrar. Deixe-o sair com naturalidade. Ao terminar, conte: quatro.',14,'Quarta respiração',4),
 cue('m18','Acompanhe mais uma respiração confortável. O ar entra. O ar sai. Cinco.',14,'Quinta respiração',5),
 cue('m19','Sem esforço, observe uma nova inspiração e uma nova expiração. Seis.',14,'Sexta respiração',6),
 cue('m20','Respire naturalmente. Ao terminar de soltar o ar, sete.',14,'Sétima respiração',7),
 cue('m21','Mais uma respiração, como ela vier. Oito.',14,'Oitava respiração',8),
 cue('m22','Observe o ar entrando e saindo. Nove.',14,'Nona respiração',9),
 cue('m23','Acompanhe esta respiração inteira, sem pressa. Ao terminar de expirar, dez.',14,'Décima respiração',10),
 cue('m24','Agora, deixe a contagem terminar. Volte a perceber seu corpo. Sinta o apoio do lugar onde está sentado. Observe os sons que chegam até você. Perceba sua respiração natural.',8,'Voltar ao ambiente'),
 cue('m25','Se seus olhos estiverem fechados, abra-os lentamente, quando se sentir confortável. Antes de continuar seu dia, reserve mais um instante. Observe como você se sente, sem precisar encontrar uma resposta específica.',8,'Abrir os olhos lentamente'),
 cue('m26','Você acabou de dedicar alguns minutos ao cuidado consigo mesmo. Estar presente é uma habilidade que pode ser exercitada. Você pode voltar a esta prática sempre que desejar. Obrigada por compartilhar este momento. Até a próxima meditação.',5,'Levar a presença com você')
];
export const grounding: Cue[] = [
 cue('g01','Mantenha os olhos abertos, se preferir. Encontre uma posição confortável. Não é preciso focar na respiração. Você pode interromper quando desejar.',8,'Chegar ao ambiente'),
 cue('g02','Olhe ao redor. Encontre uma cor que chame sua atenção. Observe uma forma. Perceba a luz no ambiente.',20,'Observar'),
 cue('g03','Perceba os pontos de apoio do seu corpo. O contato dos pés com o chão. Das mãos com uma superfície. Sem precisar mudar nada.',20,'Sentir os apoios'),
 cue('g04','Observe os sons próximos e distantes. Não é necessário nomear todos eles. Apenas perceba o que chega até você.',20,'Escutar'),
 cue('g05','Volte a olhar ao redor. Movimente as mãos suavemente. Se desejar, continue seu dia no seu tempo. Obrigada por estar aqui.',5,'Retornar')
];
export const studies = [
 {authors:'Madhav Goyal, Sonal Singh, Erica M. S. Sibinga e colaboradores',year:2014,journal:'JAMA Internal Medicine',title:'Meditation Programs for Psychological Stress and Well-being: A Systematic Review and Meta-analysis',type:'Revisão sistemática e meta-análise',summary:'A revisão de 47 ensaios encontrou evidência moderada de reduções de ansiedade em programas de mindfulness e evidência mais limitada para estresse.',limit:'Qualidade e métodos variaram. Não demonstrou superioridade a todos os tratamentos ativos. Seus achados não comprovam efeitos deste aplicativo ou de uma sessão isolada.',doi:'https://doi.org/10.1001/jamainternmed.2013.13018',source:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4142584/'},
 {authors:'Amishi P. Jha, Jason Krompinger e Michael J. Baime',year:2007,journal:'Cognitive, Affective, & Behavioral Neuroscience',title:'Mindfulness training modifies subsystems of attention',type:'Estudo com grupos de treinamento e comparação',summary:'Um curso de oito semanas e um retiro intensivo mostraram diferenças em componentes específicos da atenção, avaliados por tarefas comportamentais.',limit:'Os grupos tinham experiências prévias distintas. Não permite atribuir melhora geral de concentração a todos nem extrapolar para uma pausa breve.',doi:'https://doi.org/10.3758/CABN.7.2.109',source:'https://link.springer.com/article/10.3758/CABN.7.2.109'},
 {authors:'Michael D. Mrazek, Michael S. Franklin, Dawa Tarchin Phillips, Benjamin Baird e Jonathan W. Schooler',year:2013,journal:'Psychological Science',title:'Mindfulness Training Improves Working Memory Capacity and GRE Performance While Reducing Mind Wandering',type:'Estudo controlado randomizado',summary:'Em 48 universitários, duas semanas de treinamento se associaram a melhores resultados em tarefas de memória de trabalho e compreensão de leitura e a menos distrações que o grupo de educação nutricional.',limit:'Amostra pequena e específica, programa com aulas e prática diária. Não demonstra efeitos universais ou de uma meditação isolada.',doi:'https://doi.org/10.1177/0956797612459659',source:'https://pubmed.ncbi.nlm.nih.gov/23538911/'}
];
