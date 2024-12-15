import repository from './repository';
import { TABLE_NAME_SUGOROKU } from './table.name';

const gameRepository = repository(TABLE_NAME_SUGOROKU);

export default gameRepository;
