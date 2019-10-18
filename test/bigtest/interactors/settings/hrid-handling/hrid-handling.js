import {
  interactor,
  collection,
  property,
} from '@bigtest/interactor';
// eslint-disable-next-line
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
// eslint-disable-next-line
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor
class StartWithFieldInteractor {
  fields = collection('.startWithField', TextFieldInteractor);
}

@interactor
class AssignPrefixFieldInteractor {
  fields = collection('.assignPrefixField', TextFieldInteractor);
}

@interactor class HRIDHandlingInteractor {
  submitFormButton = new ButtonInteractor('[data-test-submit-button]');
  submitFormButtonDisabled = property('[data-test-submit-button]', 'disabled');
  startWithFields = new StartWithFieldInteractor();
  assignPrefixFields = new AssignPrefixFieldInteractor();

  static defaultScope = '[data-test-hrid-handling-form]';
}

export default new HRIDHandlingInteractor();